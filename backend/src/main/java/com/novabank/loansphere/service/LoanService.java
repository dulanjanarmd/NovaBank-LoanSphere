package com.novabank.loansphere.service;

import com.novabank.loansphere.model.CreditAssessment;
import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.model.LoanProduct;
import com.novabank.loansphere.repository.CreditAssessmentRepository;
import com.novabank.loansphere.repository.CustomerRepository;
import com.novabank.loansphere.repository.LoanApplicationRepository;
import com.novabank.loansphere.repository.LoanProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanApplicationRepository applicationRepository;
    private final LoanProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CreditAssessmentRepository assessmentRepository;
    private final NotificationService notificationService;
    private final CribIntegrationService cribIntegrationService;

    @Transactional
    public LoanApplication submitApplication(Long customerId, Long productId, String loanType, BigDecimal amount, int tenureMonths) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
                
        LoanProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (amount.compareTo(product.getMinAmount()) < 0 || amount.compareTo(product.getMaxAmount()) > 0) {
            throw new RuntimeException("Requested amount is outside the allowed product limits.");
        }

        LoanApplication application = new LoanApplication();
        application.setCustomer(customer);
        application.setLoanProduct(product);
        application.setLoanType(loanType);
        application.setRequestedAmount(amount);
        application.setTenureMonths(tenureMonths);
        application.setApplicationRef("NBLS-LN-" + loanType + "-" + System.currentTimeMillis() / 1000);
        application.setSubmittedAt(LocalDateTime.now());
        
        LoanApplication savedApp = applicationRepository.save(application);

        // Auto-run credit assessment simulation
        runCreditAssessment(savedApp);
        
        // Trigger notification
        if (customer != null) {
            String title = "Loan Application Submitted";
            String body = "Your loan application " + savedApp.getApplicationRef() + " has been successfully submitted and is under review.";
            notificationService.createNotification(customer.getCustomerId(), title, body, "LOAN_UPDATE");
        }
        
        return savedApp;
    }

    private void runCreditAssessment(LoanApplication app) {
        CreditAssessment assessment = new CreditAssessment();
        assessment.setLoanApplication(app);

        // --- CRIB Integration (certified stub) ---
        String nicNumber = app.getCustomer() != null ? app.getCustomer().getNicNumber() : "000000000V";
        Long customerId = app.getCustomer() != null ? app.getCustomer().getCustomerId() : 1L;
        Map<String, Object> cribReport = cribIntegrationService.fetchCribReport(nicNumber, customerId);

        // Set credit score from CRIB report
        int internalScore = (Integer) cribReport.getOrDefault("creditScore", 650);
        assessment.setInternalScore(internalScore);
        assessment.setCribReference((String) cribReport.getOrDefault("referenceNumber", "CRIB-ERR-001"));

        // DTI: (new EMI + existing monthly debt) / monthly income * 100
        BigDecimal existingDebt = cribIntegrationService.calculateTotalMonthlyDebt(cribReport);
        BigDecimal monthlyRate = app.getLoanProduct() != null
            ? app.getLoanProduct().getInterestRate().divide(new BigDecimal(1200), 6, RoundingMode.HALF_UP)
            : new BigDecimal("0.012");
        BigDecimal newEmi = app.getRequestedAmount().multiply(monthlyRate)
            .divide(BigDecimal.ONE.subtract(monthlyRate.negate().add(BigDecimal.ONE).pow(app.getTenureMonths())), 2, RoundingMode.HALF_UP);
        BigDecimal totalDebt = existingDebt.add(newEmi);
        BigDecimal monthlyIncome = new BigDecimal("150000"); // TODO: use customer income field when available
        BigDecimal dti = totalDebt.divide(monthlyIncome, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100));
        assessment.setDtiRatio(dti);

        // Determine decision band
        if (internalScore > 750 && dti.compareTo(new BigDecimal(40)) < 0) {
            assessment.setDecisionBand("AUTO_APPROVE");
        } else if (internalScore < 600 || dti.compareTo(new BigDecimal(60)) > 0) {
            assessment.setDecisionBand("AUTO_DECLINE");
        } else {
            assessment.setDecisionBand("MANUAL_REVIEW");
        }

        assessmentRepository.save(assessment);
    }
}
