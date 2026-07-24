package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.LoanDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanDocumentRepository extends JpaRepository<LoanDocument, Long> {
    List<LoanDocument> findByApplicationApplicationId(Long applicationId);
    List<LoanDocument> findByStatus(String status);
}
