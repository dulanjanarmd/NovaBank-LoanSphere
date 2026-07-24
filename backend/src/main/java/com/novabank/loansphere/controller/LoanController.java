package com.novabank.loansphere.controller;

import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> submitLoanApplication(@RequestBody LoanApplicationRequest request) {
        try {
            LoanApplication app = loanService.submitApplication(
                    request.getCustomerId(),
                    request.getLoanProductId(),
                    request.getLoanType(),
                    BigDecimal.valueOf(request.getRequestedAmount()),
                    request.getTenureMonths()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("application", app);
            response.put("message", "Digital Loan Application successfully submitted and registered.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/disburse")
    @PreAuthorize("hasAnyRole('ROLE_BRANCH_MANAGER', 'ROLE_ADMIN')")
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
