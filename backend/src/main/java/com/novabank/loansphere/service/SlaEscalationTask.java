package com.novabank.loansphere.service;

import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SlaEscalationTask {

    private final LoanApplicationRepository applicationRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkSlaBreaches() {
        LocalDateTime thresholdDate = LocalDateTime.now().minusDays(3);
        List<String> pendingStatuses = Arrays.asList("SUBMITTED", "PENDING_DOCS", "UNDER_REVIEW");
        List<LoanApplication> allPending = applicationRepository.findAll();
        
        for (LoanApplication app : allPending) {
            if (pendingStatuses.contains(app.getStatus()) && !app.isSlaBreached()) {
                LocalDateTime referenceTime = app.getUpdatedAt() != null ? app.getUpdatedAt() : app.getSubmittedAt();
                if (referenceTime != null && referenceTime.isBefore(thresholdDate)) {
                    app.setSlaBreached(true);
                    applicationRepository.save(app);
                    System.out.println("SLA Breached for Application: " + app.getApplicationRef());
                }
            }
        }
    }
}
