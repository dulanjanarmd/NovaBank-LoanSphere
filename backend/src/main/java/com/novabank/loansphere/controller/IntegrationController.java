package com.novabank.loansphere.controller;

import com.novabank.loansphere.service.KycIntegrationService;
import com.novabank.loansphere.service.CribIntegrationService;
import com.novabank.loansphere.service.CbsIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Integration Controller
 * Exposes stub integration endpoints for e-KYC, CRIB, and CBS.
 * These endpoints will be called from the frontend and from other services.
 */
@RestController
@RequestMapping("/api/v1/integration")
@RequiredArgsConstructor
public class IntegrationController {

    private final KycIntegrationService kycService;
    private final CribIntegrationService cribService;
    private final CbsIntegrationService cbsService;

    /**
     * e-KYC: OCR extraction from NIC
     * Frontend calls this on NIC file upload to auto-fill personal details.
     */
    @PostMapping("/kyc/ocr")
    public ResponseEntity<?> performOcr(@RequestBody Map<String, String> request) {
        String nicNumber = request.get("nicNumber");
        if (nicNumber == null || nicNumber.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "nicNumber is required"));
        }
        try {
            Map<String, String> ocrResult = kycService.extractOcrFromNic(nicNumber);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", ocrResult);
            response.put("message", "NIC scanned successfully. Please verify the extracted data.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * e-KYC: Liveness check
     */
    @PostMapping("/kyc/liveness")
    public ResponseEntity<?> performLivenessCheck() {
        Map<String, Object> result = kycService.performLivenessCheck();
        return ResponseEntity.ok(Map.of("success", true, "data", result));
    }

    /**
     * e-KYC: Watchlist / PEP screening
     */
    @PostMapping("/kyc/screen")
    public ResponseEntity<?> screenWatchlist(@RequestBody Map<String, String> request) {
        String fullName = request.getOrDefault("fullName", "");
        String nic = request.getOrDefault("nicNumber", "");
        Map<String, Object> result = kycService.performWatchlistScreening(fullName, nic);
        return ResponseEntity.ok(Map.of("success", true, "data", result));
    }

    /**
     * CRIB: Fetch credit report
     */
    @GetMapping("/crib/report")
    public ResponseEntity<?> fetchCribReport(
            @RequestParam String nicNumber,
            @RequestParam(required = false, defaultValue = "1") Long customerId) {
        Map<String, Object> report = cribService.fetchCribReport(nicNumber, customerId);
        return ResponseEntity.ok(Map.of("success", true, "data", report));
    }

    /**
     * CBS: Account verification before disbursement
     */
    @GetMapping("/cbs/verify-account")
    public ResponseEntity<?> verifyAccount(@RequestParam String accountNumber) {
        Map<String, Object> result = cbsService.verifyAccount(accountNumber);
        return ResponseEntity.ok(Map.of("success", true, "data", result));
    }

    /**
     * CBS: Generate repayment schedule
     */
    @PostMapping("/cbs/repayment-schedule")
    public ResponseEntity<?> getRepaymentSchedule(@RequestBody Map<String, Object> request) {
        BigDecimal principal = new BigDecimal(request.get("principal").toString());
        double annualRate = Double.parseDouble(request.get("annualRate").toString());
        int tenureMonths = Integer.parseInt(request.get("tenureMonths").toString());
        Map<String, Object> schedule = cbsService.generateRepaymentSchedule(principal, annualRate, tenureMonths);
        return ResponseEntity.ok(Map.of("success", true, "data", schedule));
    }
}
