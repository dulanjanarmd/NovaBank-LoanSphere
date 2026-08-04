package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.model.ApplicationCondition;
import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.model.RepaymentScheduleItem;
import com.novabank.loansphere.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Loan Controller — SRS endpoints:
 *  POST /api/v1/loans/apply         (FR-LOAN-07)
 *  POST /api/v1/loans/draft         (FR-LOAN-05)
 *  GET  /api/v1/loans/customer/{id} (customer application list)
 *  GET  /api/v1/loans/{id}          (application detail)
 *  GET  /api/v1/loans/emi-calculator (FR-LOAN-06)
 *  POST /api/v1/loans/{id}/sign     (FR-DOC-04)
 *  GET  /api/v1/loans/{id}/schedule (FR-DIS-03)
 *  GET  /api/v1/loans/{id}/conditions (FR-UW-04)
 *  PUT  /api/v1/loans/conditions/{conditionId}/fulfill (FR-UW-04)
 */
@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    // ── Submit Loan Application ────────────────────────────────────────────────

    @PostMapping("/apply")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<ApiResponse<LoanApplication>> submitLoanApplication(@RequestBody FullLoanApplicationRequest request) {
        try {
            LoanApplication app = loanService.submitApplicationFull(
                    request.getCustomerId(),
                    request.getLoanProductId(),
                    request.getLoanType(),
                    BigDecimal.valueOf(request.getRequestedAmount()),
                    request.getTenureMonths(),
                    request.getPurpose(),
                    request.getCollateralValue() > 0 ? BigDecimal.valueOf(request.getCollateralValue()) : null,
                    request.getExistingDraftId()
            );
            return ResponseEntity.ok(ApiResponse.success("Loan application submitted successfully.", app));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Save Draft ─────────────────────────────────────────────────────────────

    @PostMapping("/draft")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<ApiResponse<LoanApplication>> saveDraft(@RequestBody FullLoanApplicationRequest request) {
        try {
            LoanApplication draft = loanService.saveDraft(
                    request.getCustomerId(),
                    request.getLoanProductId(),
                    request.getLoanType(),
                    BigDecimal.valueOf(request.getRequestedAmount()),
                    request.getTenureMonths(),
                    request.getPurpose(),
                    request.getCollateralValue() > 0 ? BigDecimal.valueOf(request.getCollateralValue()) : null
            );
            return ResponseEntity.ok(ApiResponse.success("Draft saved. You can resume within 30 days.", draft));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Customer Applications ──────────────────────────────────────────────────

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<LoanApplication>>> getCustomerApplications(@PathVariable Long customerId) {
        try {
            List<LoanApplication> apps = loanService.getCustomerApplications(customerId);
            return ResponseEntity.ok(ApiResponse.success(apps));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Application Detail ────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanApplication>> getApplicationDetail(@PathVariable Long id) {
        try {
            LoanApplication app = loanService.getApplicationById(id);
            return ResponseEntity.ok(ApiResponse.success(app));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── EMI Calculator (FR-LOAN-06) ───────────────────────────────────────────

    @GetMapping("/emi-calculator")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateEmi(
            @RequestParam double principal,
            @RequestParam double rate,
            @RequestParam int tenure) {
        try {
            Map<String, Object> result = loanService.calculateEmi(
                    BigDecimal.valueOf(principal),
                    BigDecimal.valueOf(rate),
                    tenure);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── e-Signature (FR-DOC-04) ───────────────────────────────────────────────

    @PostMapping("/{id}/sign")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<ApiResponse<LoanApplication>> signLoanAgreement(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String customerNic = authentication.getName();
            String otp = request.getOrDefault("otp", "");
            if (otp.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("OTP is required for e-signature."));
            }
            LoanApplication signed = loanService.recordESignature(id, customerNic, otp);
            return ResponseEntity.ok(ApiResponse.success("Loan agreement signed successfully. Ready for disbursement.", signed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Repayment Schedule (FR-DIS-03) ────────────────────────────────────────

    @GetMapping("/{id}/schedule")
    public ResponseEntity<ApiResponse<List<RepaymentScheduleItem>>> getRepaymentSchedule(@PathVariable Long id) {
        try {
            List<RepaymentScheduleItem> schedule = loanService.getRepaymentSchedule(id);
            return ResponseEntity.ok(ApiResponse.success(schedule));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Conditions (FR-UW-04) ─────────────────────────────────────────────────

    @GetMapping("/{id}/conditions")
    public ResponseEntity<ApiResponse<List<ApplicationCondition>>> getConditions(@PathVariable Long id) {
        try {
            List<ApplicationCondition> conditions = loanService.getApplicationConditions(id);
            return ResponseEntity.ok(ApiResponse.success(conditions));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/conditions/{conditionId}/fulfill")
    @PreAuthorize("hasAnyRole('ROLE_LOAN_OFFICER', 'ROLE_BRANCH_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationCondition>> fulfillCondition(
            @PathVariable Long conditionId,
            Authentication authentication) {
        try {
            String officerName = authentication.getName();
            ApplicationCondition updated = loanService.fulfillCondition(conditionId, officerName);
            return ResponseEntity.ok(ApiResponse.success("Condition marked as fulfilled.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Old disbursement stub (kept for backward compatibility) ───────────────

    @PostMapping("/{id}/disburse")
    @PreAuthorize("hasAnyRole('ROLE_BRANCH_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<?> executeDisbursement(@PathVariable("id") Long id, @RequestBody DisbursementRequest request) {
        return ResponseEntity.ok(Map.of("success", true, "message", "Use /api/v1/staff/applications/{id}/disburse for disbursement."));
    }
}

// Request DTOs

class FullLoanApplicationRequest {
    private Long customerId;
    private Long loanProductId;
    private String loanType;
    private double requestedAmount;
    private int tenureMonths;
    private String purpose;
    private double collateralValue;
    private Long existingDraftId;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getLoanProductId() { return loanProductId; }
    public void setLoanProductId(Long loanProductId) { this.loanProductId = loanProductId; }
    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
    public double getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(double requestedAmount) { this.requestedAmount = requestedAmount; }
    public int getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(int tenureMonths) { this.tenureMonths = tenureMonths; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public double getCollateralValue() { return collateralValue; }
    public void setCollateralValue(double collateralValue) { this.collateralValue = collateralValue; }
    public Long getExistingDraftId() { return existingDraftId; }
    public void setExistingDraftId(Long existingDraftId) { this.existingDraftId = existingDraftId; }
}

class DisbursementRequest {
    private String targetAccountNumber;
    public String getTargetAccountNumber() { return targetAccountNumber; }
    public void setTargetAccountNumber(String targetAccountNumber) { this.targetAccountNumber = targetAccountNumber; }
}
