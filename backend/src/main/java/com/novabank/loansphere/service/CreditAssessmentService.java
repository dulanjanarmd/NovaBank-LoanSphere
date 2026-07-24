package com.novabank.loansphere.service;

import com.novabank.loansphere.model.CreditAssessment;
import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.repository.CreditAssessmentRepository;
import com.novabank.loansphere.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CreditAssessmentService {

    private final CreditAssessmentRepository assessmentRepository;
    private final LoanApplicationRepository applicationRepository;

    @Transactional
    public CreditAssessment performCreditAssessment(Long applicationId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Calculate mock credit score (0-1000)
        Random random = new Random();
        int score = 500 + random.nextInt(400); // Score between 500-900

        // Calculate DTI ratio (mock calculation)
        BigDecimal dtiRatio = BigDecimal.valueOf(20 + random.nextDouble() * 40).setScale(2, BigDecimal.ROUND_HALF_UP);

        // Calculate LTV ratio for secured loans
        BigDecimal ltvRatio = null;
        if (application.getLoanType().equals("HOME") || application.getLoanType().equals("VEHICLE")) {
            ltvRatio = BigDecimal.valueOf(50 + random.nextDouble() * 40).setScale(2, BigDecimal.ROUND_HALF_UP);
        }

        // Determine decision band
        String decisionBand;
        if (score >= 750) {
            decisionBand = "AUTO_APPROVE";
        } else if (score >= 600) {
            decisionBand = "MANUAL_REVIEW";
        } else {
            decisionBand = "AUTO_DECLINE";
        }

        // Generate CRIB reference
        String cribReference = "CRIB-LN-" + (10000 + random.nextInt(90000));

        CreditAssessment assessment = new CreditAssessment();
        assessment.setLoanApplication(application);
        assessment.setInternalScore(score);
        assessment.setCribReference(cribReference);
        assessment.setDtiRatio(dtiRatio);
        assessment.setLtvRatio(ltvRatio);
        assessment.setDecisionBand(decisionBand);

        return assessmentRepository.save(assessment);
    }

    public CreditAssessment getAssessmentByApplicationId(Long applicationId) {
        return assessmentRepository.findByLoanApplicationApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Credit assessment not found"));
    }
}
