package com.novabank.loansphere.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CRIB Integration Service — Certified Stub
 * 
 * Simulates the Credit Information Bureau of Sri Lanka (CRIB) API.
 * In production, replace with actual authenticated HTTPS calls to CRIB's REST API
 * using institution credentials provided by Central Bank of Sri Lanka.
 * 
 * Stub returns a deterministic report based on the NIC/customerId seed.
 */
@Service
public class CribIntegrationService {

    /**
     * Fetch a full CRIB credit report for a customer.
     *
     * @param nicNumber  Customer's NIC number
     * @param customerId Internal customer ID
     * @return CribReport as a Map
     */
    public Map<String, Object> fetchCribReport(String nicNumber, Long customerId) {
        // Simulate network latency for realism
        try { Thread.sleep(600); } catch (InterruptedException ignored) {}

        String cribRef = "CRIB-LK-" + System.currentTimeMillis();

        Map<String, Object> report = new HashMap<>();
        report.put("referenceNumber", cribRef);
        report.put("inquiryDate", LocalDate.now().toString());
        report.put("status", "SUCCESS");

        // Derive a deterministic score (real CRIB scores are 1-1000)
        int seed = customerId != null ? customerId.intValue() : 5;
        int creditScore = 600 + (seed * 37 % 350); // 600–950 range
        report.put("creditScore", creditScore);
        report.put("scoreModel", "CRIB_SL_v2.1");

        // Active facilities
        List<Map<String, Object>> facilities = new ArrayList<>();
        if (creditScore < 700) {
            // Lower score customers have more facilities
            facilities.add(buildFacility("Personal Loan", "Standard Bank", new BigDecimal("350000"), new BigDecimal("12500"), "PERFORMING"));
            facilities.add(buildFacility("Credit Card", "HNB", new BigDecimal("150000"), new BigDecimal("4500"), "PERFORMING"));
        } else if (creditScore < 800) {
            facilities.add(buildFacility("Vehicle Loan", "Peoples Bank", new BigDecimal("2500000"), new BigDecimal("42000"), "PERFORMING"));
        }
        report.put("activeFacilities", facilities);

        // Default history
        report.put("npAFacilities", 0);
        report.put("defaultCount", creditScore < 650 ? 1 : 0);
        report.put("totalOutstanding", facilities.stream()
            .mapToLong(f -> ((BigDecimal) f.get("outstanding")).longValue()).sum());

        // Enquiry history
        report.put("enquiriesLast6Months", seed % 3);

        return report;
    }

    private Map<String, Object> buildFacility(String type, String institution, BigDecimal limit, BigDecimal emi, String status) {
        Map<String, Object> f = new HashMap<>();
        f.put("facilityType", type);
        f.put("institution", institution);
        f.put("approvedLimit", limit);
        f.put("outstanding", limit.multiply(new BigDecimal("0.7")));
        f.put("monthlyInstallment", emi);
        f.put("status", status);
        return f;
    }

    /**
     * Calculate monthly debt burden from a CRIB report (sum of all EMIs).
     */
    public BigDecimal calculateTotalMonthlyDebt(Map<String, Object> cribReport) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> facilities = (List<Map<String, Object>>) cribReport.getOrDefault("activeFacilities", new ArrayList<>());
        return facilities.stream()
            .map(f -> (BigDecimal) f.get("monthlyInstallment"))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
