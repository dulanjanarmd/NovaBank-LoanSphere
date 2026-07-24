package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.CreditAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreditAssessmentRepository extends JpaRepository<CreditAssessment, Long> {
    Optional<CreditAssessment> findByLoanApplicationApplicationId(Long applicationId);
}
