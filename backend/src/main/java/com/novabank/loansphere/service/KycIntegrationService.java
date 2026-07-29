package com.novabank.loansphere.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * KYC Integration Service — Certified Stub
 * 
 * This service simulates an e-KYC vendor API. In production, replace the
 * stub responses with actual HTTP calls to the contracted vendor (e.g., SriLanka eKYC API).
 * 
 * Simulated endpoints:
 *  - OCR extraction from NIC image
 *  - Liveness / selfie verification
 *  - Sanctions / PEP watchlist screening
 */
@Service
public class KycIntegrationService {

    /**
     * Simulate OCR extraction from a NIC image.
     * In production: POST the image bytes to the vendor endpoint and parse the response.
     *
     * @param nicNumber The NIC number provided by the user (used as seed for deterministic mock data)
     * @return Map of extracted fields: firstName, lastName, dob, gender
     */
    public Map<String, String> extractOcrFromNic(String nicNumber) {
        // Simulate network delay
        try { Thread.sleep(500); } catch (InterruptedException ignored) {}

        Map<String, String> result = new HashMap<>();

        // Derive gender from NIC (Sri Lanka NIC standard)
        boolean isOldNic = nicNumber != null && nicNumber.length() == 10;
        String gender = "Male";
        if (nicNumber != null && nicNumber.length() >= 7) {
            int dayCode = Integer.parseInt(nicNumber.substring(2, 5));
            if (dayCode > 500) {
                gender = "Female";
                dayCode -= 500;
            }
            // Approximate DOB from NIC (simplified)
            int year = isOldNic ? 1900 + Integer.parseInt(nicNumber.substring(0, 2)) 
                                : Integer.parseInt(nicNumber.substring(0, 4));
            result.put("dob", year + "-01-01"); // Approximate only
        }

        result.put("firstName", "Extracted");
        result.put("lastName", "from NIC-" + (nicNumber != null ? nicNumber.substring(0, 3) : "XXX") + "...");
        result.put("gender", gender);
        result.put("nicVerified", "true");
        result.put("ocrConfidence", "97.3");
        result.put("documentType", "SRI_LANKA_NIC");

        return result;
    }

    /**
     * Simulate liveness / selfie verification.
     * In production: POST the selfie image to a biometric vendor endpoint.
     *
     * @return result with liveness score, status
     */
    public Map<String, Object> performLivenessCheck() {
        try { Thread.sleep(300); } catch (InterruptedException ignored) {}

        Map<String, Object> result = new HashMap<>();
        result.put("livenessScore", 98.7);
        result.put("passed", true);
        result.put("faceMatchScore", 96.2);
        result.put("status", "VERIFIED");
        result.put("vendor", "eKYC-STUB-v1.0");
        return result;
    }

    /**
     * Simulate sanctions and PEP (Politically Exposed Persons) watchlist screening.
     * In production: Call a compliance data provider (e.g., Dow Jones, Refinitiv World-Check).
     *
     * @param fullName Customer name to screen
     * @param nicNumber NIC number to match
     * @return result with hit status, risk tier
     */
    public Map<String, Object> performWatchlistScreening(String fullName, String nicNumber) {
        try { Thread.sleep(200); } catch (InterruptedException ignored) {}

        Map<String, Object> result = new HashMap<>();
        // Stub: no hits
        result.put("pepHit", false);
        result.put("sanctionsHit", false);
        result.put("adverseMediaHit", false);
        result.put("riskTier", "LOW");
        result.put("screeningRef", "SCR-" + System.currentTimeMillis());
        result.put("screenedAt", LocalDate.now().toString());
        return result;
    }
}
