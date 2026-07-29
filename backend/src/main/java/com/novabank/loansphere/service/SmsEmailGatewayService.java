package com.novabank.loansphere.service;

import org.springframework.stereotype.Service;
import java.util.logging.Logger;

/**
 * SMS & Email Gateway Service — Certified Stub
 * 
 * Simulates outbound SMS and Email notifications via an external gateway.
 * 
 * In production:
 *  - SMS: Replace with Dialog/Hutch/Mobitel SMPP or REST API calls.
 *    Example providers: Twilio, Vonage, or Sri Lanka Telecom SMS gateway.
 *  - Email: Replace with SMTP (Gmail/SES) or transactional email API (SendGrid, Mailgun).
 * 
 * All message payloads are logged to demonstrate the integration pattern.
 */
@Service
public class SmsEmailGatewayService {

    private static final Logger log = Logger.getLogger(SmsEmailGatewayService.class.getName());

    /**
     * Send an SMS notification to a customer mobile number.
     * 
     * @param mobileNumber Recipient mobile in international format (+94XXXXXXXXX)
     * @param message      Plain text message content (max 160 chars for single SMS)
     * @param referenceId  Application reference for delivery tracking
     */
    public void sendSms(String mobileNumber, String message, String referenceId) {
        // In production:
        // HttpRequest request = HttpRequest.newBuilder()
        //     .uri(URI.create("https://sms-gateway.provider.lk/send"))
        //     .header("Authorization", "Bearer " + apiKey)
        //     .POST(HttpRequest.BodyPublishers.ofString(json))
        //     .build();
        // HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        log.info("=== SMS GATEWAY (STUB) ===");
        log.info("TO: " + maskMobile(mobileNumber));
        log.info("REF: " + referenceId);
        log.info("MSG: " + message);
        log.info("STATUS: DELIVERED (stub)");
        log.info("=========================");
    }

    /**
     * Send an email notification.
     * 
     * @param emailAddress Recipient email address
     * @param subject      Email subject line
     * @param htmlBody     HTML body content
     * @param referenceId  Application reference for delivery tracking
     */
    public void sendEmail(String emailAddress, String subject, String htmlBody, String referenceId) {
        // In production:
        // Use JavaMailSender (Spring Boot Mail) or HTTP API to SendGrid/Mailgun/SES

        log.info("=== EMAIL GATEWAY (STUB) ===");
        log.info("TO: " + maskEmail(emailAddress));
        log.info("SUBJECT: " + subject);
        log.info("REF: " + referenceId);
        log.info("BODY LENGTH: " + (htmlBody != null ? htmlBody.length() : 0) + " chars");
        log.info("STATUS: SENT (stub)");
        log.info("===========================");
    }

    /**
     * Send both SMS and email for a given notification event.
     *
     * @param mobileNumber  Customer mobile
     * @param emailAddress  Customer email
     * @param eventType     Event type label (e.g., LOAN_SUBMITTED, APPROVED)
     * @param message       Short text message
     * @param referenceId   Application or account reference
     */
    public void notifyCustomer(String mobileNumber, String emailAddress, String eventType,
                                String message, String referenceId) {
        String smsText = "[NovaBank] " + message + " Ref: " + referenceId;
        String emailSubject = "NovaBank LoanSphere — " + eventType.replace("_", " ");
        String emailHtml = "<p>Dear Customer,</p><p>" + message + "</p><p>Reference: <strong>" + referenceId + "</strong></p>"
                + "<p>Thank you for banking with NovaBank.</p>";

        if (mobileNumber != null && !mobileNumber.isBlank()) {
            sendSms(mobileNumber, smsText, referenceId);
        }
        if (emailAddress != null && !emailAddress.isBlank()) {
            sendEmail(emailAddress, emailSubject, emailHtml, referenceId);
        }
    }

    // Utility methods to mask PII in logs
    private String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 6) return "***";
        return mobile.substring(0, 4) + "****" + mobile.substring(mobile.length() - 2);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        String[] parts = email.split("@");
        return parts[0].substring(0, Math.min(2, parts[0].length())) + "****@" + parts[1];
    }
}
