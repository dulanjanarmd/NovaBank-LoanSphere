package com.novabank.loansphere.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * Core Banking System (CBS) Integration Service — Certified Stub
 * 
 * This service simulates the bank's Core Banking System (CBS) API.
 * In production, replace with authenticated HTTPS calls to the CBS REST/SOAP gateway
 * (e.g., Temenos T24, Finacle, or FinnOne Neo).
 * 
 * SRS requirement: 3 retries on CBS failure before raising an alert.
 */
@Service
public class CbsIntegrationService {

    private static final Logger log = Logger.getLogger(CbsIntegrationService.class.getName());
    private static final int MAX_RETRIES = 3;

    /**
     * Post a loan disbursement instruction to the CBS.
     * Implements retry logic as per SRS FR-DIS-05.
     *
     * @param applicationRef    Application reference number
     * @param disbursedAmount   Amount to disburse
     * @param targetAccountNo   Customer's credit account number
     * @param officerCode       Authorizing officer code
     * @return disbursement result map
     */
    public Map<String, Object> postDisbursement(String applicationRef, BigDecimal disbursedAmount,
                                                String targetAccountNo, String officerCode) {
        Exception lastException = null;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                log.info("[CBS] Disbursement attempt " + attempt + " for " + applicationRef);
                return executeDisburse(applicationRef, disbursedAmount, targetAccountNo, officerCode);
            } catch (Exception e) {
                lastException = e;
                log.warning("[CBS] Attempt " + attempt + " failed: " + e.getMessage());
                if (attempt < MAX_RETRIES) {
                    try { Thread.sleep(500L * attempt); } catch (InterruptedException ignored) {}
                }
            }
        }

        // All retries exhausted — raise alert
        log.severe("[CBS-ALERT] Disbursement FAILED after " + MAX_RETRIES + " retries for " + applicationRef
                + ". Manual intervention required! Error: " + (lastException != null ? lastException.getMessage() : "Unknown"));
        throw new RuntimeException("CBS disbursement failed after " + MAX_RETRIES + " retries. Alert raised.");
    }

    private Map<String, Object> executeDisburse(String appRef, BigDecimal amount,
                                                String accountNo, String officer) {
        // Simulate a very occasional CBS timeout (5% chance, disabled for demo stability)
        // if (Math.random() < 0.05) throw new RuntimeException("CBS timeout: gateway unreachable");

        // Simulate small network delay
        try { Thread.sleep(300); } catch (InterruptedException ignored) {}

        String cbsRef = "CBS-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String ledgerRef = "LED-" + System.currentTimeMillis();

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("cbsReference", cbsRef);
        result.put("ledgerReference", ledgerRef);
        result.put("applicationRef", appRef);
        result.put("disbursedAmount", amount);
        result.put("creditAccount", accountNo);
        result.put("authorizedBy", officer);
        result.put("channel", "DIGITAL_BANKING_API");
        result.put("status", "POSTED");

        log.info("[CBS] Disbursement SUCCESS: " + cbsRef + " — LKR " + amount + " → Acc " + accountNo);
        return result;
    }

    /**
     * Query account balance from CBS (used before disbursement to verify account is active).
     *
     * @param accountNo Account number to verify
     * @return account status map
     */
    public Map<String, Object> verifyAccount(String accountNo) {
        try { Thread.sleep(100); } catch (InterruptedException ignored) {}

        Map<String, Object> result = new HashMap<>();
        result.put("accountNumber", accountNo);
        result.put("status", "ACTIVE");
        result.put("accountType", "SAVINGS");
        result.put("currency", "LKR");
        result.put("verified", true);
        return result;
    }

    /**
     * Generate an amortization repayment schedule.
     * 
     * @param principal    Loan principal
     * @param annualRate   Annual interest rate (e.g., 14.5 for 14.5%)
     * @param tenureMonths Loan tenure in months
     * @return schedule as a formatted string (JSON-like summary)
     */
    public Map<String, Object> generateRepaymentSchedule(BigDecimal principal, double annualRate, int tenureMonths) {
        double monthlyRate = annualRate / 100.0 / 12.0;
        double emi = principal.doubleValue() * monthlyRate / (1 - Math.pow(1 + monthlyRate, -tenureMonths));
        double totalRepayable = emi * tenureMonths;
        double totalInterest = totalRepayable - principal.doubleValue();

        Map<String, Object> schedule = new HashMap<>();
        schedule.put("principalAmount", principal);
        schedule.put("annualInterestRate", annualRate);
        schedule.put("tenureMonths", tenureMonths);
        schedule.put("monthlyInstallment", Math.round(emi));
        schedule.put("totalRepayable", Math.round(totalRepayable));
        schedule.put("totalInterestPayable", Math.round(totalInterest));
        schedule.put("scheduleRef", "SCHED-" + System.currentTimeMillis());
        return schedule;
    }
}
