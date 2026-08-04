package com.novabank.loansphere.service;

import com.novabank.loansphere.model.*;
import com.novabank.loansphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Loan Service — implements SRS loan origination requirements:
 *  FR-LOAN-01 through FR-LOAN-07
 *  FR-CRD-01 through FR-CRD-06
 *  FR-DIS-01 through FR-DIS-05
 *  FR-DOC-04 (e-signature recording)
 */
@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanApplicationRepository applicationRepository;
    private final LoanProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CreditAssessmentRepository assessmentRepository;
    private final RepaymentScheduleItemRepository repaymentRepository;
    private final NotificationService notificationService;
    private final CribIntegrationService cribIntegrationService;
    private final SystemConfigRepository systemConfigRepository;
    private final ApplicationConditionRepository conditionRepository;

    // ─── Application Reference Generator ─────────────────────────────────────

    private String generateApplicationRef(String loanType) {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String seq = String.format("%05d", (int)(Math.random() * 99999) + 1);
        return "NBLS-LN-" + loanType + "-" + date + "-" + seq;
    }

    // ─── EMI Calculator (FR-LOAN-06) ─────────────────────────────────────────

    public Map<String, Object> calculateEmi(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal(1200), 8, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowN = onePlusR.pow(tenureMonths);
        BigDecimal emi = principal.multiply(monthlyRate).multiply(onePlusRPowN)
                .divide(onePlusRPowN.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
        BigDecimal totalPayable = emi.multiply(new BigDecimal(tenureMonths));
        BigDecimal totalInterest = totalPayable.subtract(principal);

        Map<String, Object> result = new HashMap<>();
        result.put("monthlyInstallment", emi);
        result.put("totalPayable", totalPayable.setScale(2, RoundingMode.HALF_UP));
        result.put("totalInterest", totalInterest.setScale(2, RoundingMode.HALF_UP));
        result.put("principal", principal);
        result.put("annualRate", annualRate);
        result.put("tenureMonths", tenureMonths);
        return result;
    }

    // ─── Save Draft Application (FR-LOAN-05) ─────────────────────────────────

    @Transactional
    public LoanApplication saveDraft(Long customerId, Long productId, String loanType,
                                     BigDecimal amount, int tenureMonths, String purpose,
                                     BigDecimal collateralValue) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        LoanProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Loan product not found"));

        // Get draft expiry from config (default 30 days)
        int draftDays = getConfigInt("DRAFT_EXPIRY_DAYS", 30);

        LoanApplication application = new LoanApplication();
        application.setCustomer(customer);
        application.setLoanProduct(product);
        application.setLoanType(loanType);
        application.setRequestedAmount(amount);
        application.setTenureMonths(tenureMonths);
        application.setPurpose(purpose);
        application.setCollateralValue(collateralValue);
        application.setStatus("DRAFT");
        application.setApplicationRef(generateApplicationRef(loanType));
        application.setDraftExpiresAt(LocalDateTime.now().plusDays(draftDays));
        return applicationRepository.save(application);
    }

    // ─── Submit Loan Application (FR-LOAN-07) ─────────────────────────────────

    @Transactional
    public LoanApplication submitApplication(Long customerId, Long productId, String loanType,
                                             BigDecimal amount, int tenureMonths) {
        return submitApplicationFull(customerId, productId, loanType, amount, tenureMonths, null, null, null);
    }

    @Transactional
    public LoanApplication submitApplicationFull(Long customerId, Long productId, String loanType,
                                                  BigDecimal amount, int tenureMonths,
                                                  String purpose, BigDecimal collateralValue,
                                                  Long existingDraftId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        LoanProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Validate amount within product limits (FR-LOAN-02)
        if (amount.compareTo(product.getMinAmount()) < 0 || amount.compareTo(product.getMaxAmount()) > 0) {
            throw new RuntimeException("Requested amount LKR " + amount + " is outside allowed range: LKR "
                    + product.getMinAmount() + " – LKR " + product.getMaxAmount());
        }

        // LTV enforcement for HOME/VEHICLE (FR-CRD-04)
        if ((loanType.equals("HOME") || loanType.equals("VEHICLE")) && collateralValue != null
                && product.getMaxLtv() != null) {
            BigDecimal maxLoanByLtv = collateralValue.multiply(product.getMaxLtv())
                    .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            if (amount.compareTo(maxLoanByLtv) > 0) {
                throw new RuntimeException("Requested amount exceeds the maximum LTV limit. Maximum eligible: LKR " + maxLoanByLtv);
            }
        }

        LoanApplication application;
        if (existingDraftId != null) {
            application = applicationRepository.findById(existingDraftId)
                    .orElse(new LoanApplication());
        } else {
            application = new LoanApplication();
            application.setApplicationRef(generateApplicationRef(loanType));
        }

        application.setCustomer(customer);
        application.setLoanProduct(product);
        application.setLoanType(loanType);
        application.setRequestedAmount(amount);
        application.setTenureMonths(tenureMonths);
        application.setPurpose(purpose);
        application.setCollateralValue(collateralValue);
        application.setStatus("SUBMITTED");
        application.setSubmittedAt(LocalDateTime.now());
        application.setDraftExpiresAt(null);

        LoanApplication savedApp = applicationRepository.save(application);

        // Auto-trigger credit assessment
        runCreditAssessment(savedApp);

        // Trigger notification (FR-NOT-01)
        if (customer != null) {
            notificationService.createNotification(customer.getCustomerId(),
                    "Loan Application Submitted",
                    "Your loan application " + savedApp.getApplicationRef() + " has been submitted and is under review.",
                    "LOAN_UPDATE");
        }
        return savedApp;
    }

    // ─── e-Signature (FR-DOC-04) ─────────────────────────────────────────────

    @Transactional
    public LoanApplication recordESignature(Long applicationId, String customerNic, String otp) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getStatus().equals("APPROVED") && !application.getStatus().equals("APPROVED_CONDITIONAL")) {
            throw new RuntimeException("e-Signature is only available for approved applications.");
        }

        // OTP verification is handled externally; here we record the event
        application.seteSigned(true);
        application.seteSignedAt(LocalDateTime.now());
        application.setStatus("SIGNED");
        application.setUpdatedAt(LocalDateTime.now());
        LoanApplication saved = applicationRepository.save(application);

        // Notify customer
        if (application.getCustomer() != null) {
            notificationService.createNotification(
                    application.getCustomer().getCustomerId(),
                    "Loan Agreement Signed",
                    "You have successfully signed the loan agreement for " + application.getApplicationRef() + ". Your application is now ready for disbursement.",
                    "LOAN_UPDATE");
        }
        return saved;
    }

    // ─── Get Customer Applications ─────────────────────────────────────────────

    public List<LoanApplication> getCustomerApplications(Long customerId) {
        return applicationRepository.findByCustomerCustomerId(customerId);
    }

    public LoanApplication getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));
    }

    // ─── Repayment Schedule (FR-DIS-03) ───────────────────────────────────────

    @Transactional
    public List<RepaymentScheduleItem> generateAndSaveRepaymentSchedule(Long applicationId) {
        LoanApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        BigDecimal principal = app.getRequestedAmount();
        BigDecimal annualRate = app.getLoanProduct().getInterestRate();
        int tenure = app.getTenureMonths();

        BigDecimal monthlyRate = annualRate.divide(new BigDecimal(1200), 8, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowN = onePlusR.pow(tenure);
        BigDecimal emi = principal.multiply(monthlyRate).multiply(onePlusRPowN)
                .divide(onePlusRPowN.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);

        List<RepaymentScheduleItem> schedule = new ArrayList<>();
        BigDecimal balance = principal;
        LocalDate dueDate = LocalDate.now().plusMonths(1);

        for (int i = 1; i <= tenure; i++) {
            BigDecimal interest = balance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalPart = (i == tenure)
                    ? balance  // Last installment: clear remaining balance
                    : emi.subtract(interest).setScale(2, RoundingMode.HALF_UP);
            balance = balance.subtract(principalPart).setScale(2, RoundingMode.HALF_UP);
            if (balance.compareTo(BigDecimal.ZERO) < 0) balance = BigDecimal.ZERO;

            RepaymentScheduleItem item = new RepaymentScheduleItem();
            item.setApplicationId(applicationId);
            item.setInstallmentNo(i);
            item.setDueDate(dueDate.plusMonths(i - 1));
            item.setEmiAmount(emi.max(principalPart.add(interest)));
            item.setPrincipalAmount(principalPart);
            item.setInterestAmount(interest);
            item.setRemainingBalance(balance);
            schedule.add(item);
        }

        return repaymentRepository.saveAll(schedule);
    }

    public List<RepaymentScheduleItem> getRepaymentSchedule(Long applicationId) {
        return repaymentRepository.findByApplicationId(applicationId);
    }

    // ─── Conditional Approval (FR-UW-04) ──────────────────────────────────────

    public List<ApplicationCondition> getApplicationConditions(Long applicationId) {
        return conditionRepository.findByApplicationId(applicationId);
    }

    @Transactional
    public ApplicationCondition fulfillCondition(Long conditionId, String officerName) {
        ApplicationCondition condition = conditionRepository.findById(conditionId)
                .orElseThrow(() -> new RuntimeException("Condition not found"));
        condition.setFulfilled(true);
        condition.setFulfilledBy(officerName);
        condition.setFulfilledAt(LocalDateTime.now());
        return conditionRepository.save(condition);
    }

    public boolean allConditionsFulfilled(Long applicationId) {
        return !conditionRepository.existsByApplicationIdAndFulfilledFalse(applicationId);
    }

    // ─── Credit Assessment (FR-CRD-01 through FR-CRD-06) ──────────────────────

    private void runCreditAssessment(LoanApplication app) {
        CreditAssessment assessment = new CreditAssessment();
        assessment.setLoanApplication(app);

        String nicNumber = app.getCustomer() != null ? app.getCustomer().getNicNumber() : "000000000V";
        Long customerId = app.getCustomer() != null ? app.getCustomer().getCustomerId() : 1L;
        Map<String, Object> cribReport = cribIntegrationService.fetchCribReport(nicNumber, customerId);

        int internalScore = (Integer) cribReport.getOrDefault("creditScore", 650);
        assessment.setInternalScore(internalScore);
        assessment.setCribReference((String) cribReport.getOrDefault("referenceNumber", "CRIB-ERR-001"));

        // DTI calculation (FR-CRD-03)
        BigDecimal existingDebt = cribIntegrationService.calculateTotalMonthlyDebt(cribReport);
        BigDecimal monthlyRate = app.getLoanProduct() != null
                ? app.getLoanProduct().getInterestRate().divide(new BigDecimal(1200), 6, RoundingMode.HALF_UP)
                : new BigDecimal("0.012");
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowN = onePlusR.pow(app.getTenureMonths());
        BigDecimal newEmi = app.getRequestedAmount().multiply(monthlyRate).multiply(onePlusRPowN)
                .divide(onePlusRPowN.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
        BigDecimal totalDebt = existingDebt.add(newEmi);

        BigDecimal monthlyIncome = app.getCustomer() != null && app.getCustomer().getMonthlyTurnover() != null
                && app.getCustomer().getMonthlyTurnover().compareTo(BigDecimal.ZERO) > 0
                ? app.getCustomer().getMonthlyTurnover()
                : new BigDecimal("150000");

        BigDecimal dti = totalDebt.divide(monthlyIncome, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100));
        assessment.setDtiRatio(dti);

        // LTV (FR-CRD-04)
        if (app.getCollateralValue() != null && app.getCollateralValue().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal ltv = app.getRequestedAmount()
                    .divide(app.getCollateralValue(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(100));
            assessment.setLtvRatio(ltv);
        }

        // Admin-configurable thresholds (FR-CRD-06)
        int autoApproveMin = getConfigInt("AUTO_APPROVE_SCORE_MIN", 750);
        int autoDeclineMax = getConfigInt("AUTO_DECLINE_SCORE_MAX", 599);
        BigDecimal dtiThreshold = getConfigDecimal("DTI_THRESHOLD_PCT", new BigDecimal("40"));

        if (internalScore >= autoApproveMin && dti.compareTo(dtiThreshold) < 0) {
            assessment.setDecisionBand("AUTO_APPROVE");
        } else if (internalScore <= autoDeclineMax || dti.compareTo(new BigDecimal("60")) > 0) {
            assessment.setDecisionBand("AUTO_DECLINE");
        } else {
            assessment.setDecisionBand("MANUAL_REVIEW");
        }

        assessmentRepository.save(assessment);
    }

    // ─── Config Helpers ─────────────────────────────────────────────────────────

    private int getConfigInt(String key, int defaultVal) {
        try {
            return systemConfigRepository.findByConfigKey(key)
                    .map(c -> Integer.parseInt(c.getConfigValue()))
                    .orElse(defaultVal);
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private BigDecimal getConfigDecimal(String key, BigDecimal defaultVal) {
        try {
            return systemConfigRepository.findByConfigKey(key)
                    .map(c -> new BigDecimal(c.getConfigValue()))
                    .orElse(defaultVal);
        } catch (Exception e) {
            return defaultVal;
        }
    }
}
