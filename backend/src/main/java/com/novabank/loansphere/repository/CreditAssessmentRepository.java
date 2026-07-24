package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.CreditAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditAssessmentRepository extends JpaRepository<CreditAssessment, Long> {
}
