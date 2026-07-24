package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.KYCRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KYCRecordRepository extends JpaRepository<KYCRecord, Long> {
    Optional<KYCRecord> findByCustomerCustomerId(Long customerId);
}
