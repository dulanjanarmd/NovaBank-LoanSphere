package com.novabank.loansphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import java.util.*;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    // Simulating database storage operations
    private final List<Map<String, Object>> loanApplicationsDb = new ArrayList<>();

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> submitLoanApplication(@RequestBody LoanApplicationRequest request) {
        
        String refNo = "NBLS-LN-" + request.getLoanType() + "-" + System.currentTimeMillis() / 10000;
        
        Map<String, Object> loanApp = new HashMap<>();
        loanApp.put("application_id", System.currentTimeMillis());
        loanApp.put("application_ref", refNo);
        loanApp.put("customer_id", request.getCustomerId());
        loanApp.put("loan_type", request.getLoanType());
        loanApp.put("requested_amount", request.getRequestedAmount());
        loanApp.put("tenure_months", request.getTenureMonths());
        loanApp.put("status", "SUBMITTED");
        loanApp.put("submitted_at", new Date());

        // Dynamic credit scoring calculation
        int internalScore = 650 + (int)(Math.random() * 250); // rule scoring simulator
        double dti = (request.getRequestedAmount() / 24) / 150000 * 100; // debt ratio check

        Map<String, Object> assessment = new HashMap<>();
        assessment.put("internal_score", internalScore);
        assessment.put("dti_ratio", Math.round(dti * 10.0) / 10.0);
        assessment.put("decision_band", internalScore > 750 ? "AUTO_APPROVE" : "MANUAL_REVIEW");
        loanApp.put("assessment", assessment);

        loanApplicationsDb.add(loanApp);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("application", loanApp);
        response.put("message", "Digital Loan Application successfully submitted and registered.");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/disburse")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER', 'ADMIN')")
    public ResponseEntity<?> executeDisbursement(@PathVariable("id") Long id, @RequestBody DisbursementRequest request) {
        
        // Simulating core CBS transaction call
        String reference = "CBS-DISB-" + (100000 + (int)(Math.random() * 900000));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        Map<String, Object> disbDetails = new HashMap<>();
        disbDetails.put("account_number", request.getTargetAccountNumber());
        disbDetails.put("disbursed_at", new Date());
        disbDetails.put("reference", reference);
        response.put("disbursement", disbDetails);
        response.put("message", "Core Banking System disbursement posted successfully. Ledger updated.");

        return ResponseEntity.ok(response);
    }
}

@Data
class LoanApplicationRequest {
    private Long customerId;
    private Long loanProductId;
    private String loanType;
    private double requestedAmount;
    private int tenureMonths;
}

@Data
class DisbursementRequest {
    private String targetAccountNumber;
}
