package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisbursementRepository extends JpaRepository<Disbursement, Long> {
    Optional<Disbursement> findByApplicationApplicationId(Long applicationId);
}
