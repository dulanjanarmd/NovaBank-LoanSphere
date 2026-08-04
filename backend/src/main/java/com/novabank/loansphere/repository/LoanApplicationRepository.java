package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByStatus(String status);
    List<LoanApplication> findByCustomerCustomerId(Long customerId);

    @Query("SELECT a FROM LoanApplication a WHERE a.customer.customerId = :customerId ORDER BY a.createdAt DESC")
    List<LoanApplication> findByCustomerIdOrdered(@Param("customerId") Long customerId);

    Optional<LoanApplication> findByApplicationRef(String applicationRef);

    @Query("SELECT a FROM LoanApplication a WHERE a.status IN :statuses AND a.submittedAt BETWEEN :from AND :to")
    List<LoanApplication> findByStatusInAndDateRange(
            @Param("statuses") List<String> statuses,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("SELECT COUNT(a) FROM LoanApplication a WHERE a.customer.riskTier = :riskTier")
    long countByRiskTier(@Param("riskTier") String riskTier);

    @Query("SELECT SUM(a.requestedAmount) FROM LoanApplication a WHERE a.status = 'DISBURSED'")
    BigDecimal sumDisbursedAmount();

    @Query("SELECT a FROM LoanApplication a WHERE a.status = 'DRAFT' AND a.draftExpiresAt < :now")
    List<LoanApplication> findExpiredDrafts(@Param("now") LocalDateTime now);

    @Query("SELECT a FROM LoanApplication a WHERE a.status = 'APPROVED' AND a.eSignedAt IS NULL AND a.updatedAt < :expiryThreshold")
    List<LoanApplication> findExpiredOffers(@Param("expiryThreshold") LocalDateTime expiryThreshold);
}
