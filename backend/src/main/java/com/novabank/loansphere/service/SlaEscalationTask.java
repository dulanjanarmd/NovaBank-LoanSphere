package com.novabank.loansphere.service;

import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.repository.LoanApplicationRepository;
import com.novabank.loansphere.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

/**
 * SLA Escalation Task — FR-UW-05
 * Runs every 60 seconds; marks SLA breach and sends Admin notification.
 * SLA threshold read from admin-configurable system_config table.
 */
@Component
@RequiredArgsConstructor
public class SlaEscalationTask {

    private static final Logger log = Logger.getLogger(SlaEscalationTask.class.getName());

    private final LoanApplicationRepository applicationRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkSlaBreaches() {
        // Read SLA days from admin config (default: 3 business days)
        int slaDays = systemConfigRepository.findByConfigKey("SLA_REVIEW_DAYS")
                .map(c -> {
                    try { return Integer.parseInt(c.getConfigValue()); } catch (Exception e) { return 3; }
                }).orElse(3);

        LocalDateTime thresholdDate = LocalDateTime.now().minusDays(slaDays);
        List<String> pendingStatuses = Arrays.asList("SUBMITTED", "PENDING_DOCS", "UNDER_REVIEW");
        List<LoanApplication> allPending = applicationRepository.findAll();

        for (LoanApplication app : allPending) {
            if (pendingStatuses.contains(app.getStatus()) && !app.isSlaBreached()) {
                LocalDateTime referenceTime = app.getUpdatedAt() != null ? app.getUpdatedAt() : app.getSubmittedAt();
                if (referenceTime != null && referenceTime.isBefore(thresholdDate)) {
                    app.setSlaBreached(true);
                    applicationRepository.save(app);
                    log.warning("[SLA-BREACH] Application: " + app.getApplicationRef()
                            + " | Type: " + app.getLoanType()
                            + " | Status: " + app.getStatus()
                            + " | Pending since: " + referenceTime);

                    // FR-UW-05: Send Admin notification for SLA breach
                    try {
                        // Notify via system notification (visible in admin dashboard)
                        notificationService.createNotification(
                                null, // null = system/admin notification (broadcast)
                                "⚠️ SLA Breach — " + app.getApplicationRef(),
                                "Application " + app.getApplicationRef() + " (" + app.getLoanType() + " loan) has breached the " + slaDays + "-day SLA. Immediate review required.",
                                "SLA_BREACH"
                        );
                    } catch (Exception e) {
                        log.warning("[SLA-BREACH-NOTIFY] Failed to send admin notification: " + e.getMessage());
                    }
                }
            }
        }

        // Also expire outdated DRAFT applications
        List<LoanApplication> expiredDrafts = applicationRepository.findExpiredDrafts(LocalDateTime.now());
        for (LoanApplication draft : expiredDrafts) {
            draft.setStatus("OFFER_EXPIRED");
            applicationRepository.save(draft);
            log.info("[DRAFT-EXPIRED] Expired draft: " + draft.getApplicationRef());
        }
    }
}
