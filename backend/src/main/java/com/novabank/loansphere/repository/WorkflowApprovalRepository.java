package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.WorkflowApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowApprovalRepository extends JpaRepository<WorkflowApproval, Long> {
    List<WorkflowApproval> findByApplicationApplicationId(Long applicationId);
    List<WorkflowApproval> findByRole(String role);
    Optional<WorkflowApproval> findFirstByApplicationApplicationIdOrderByApprovalIdDesc(Long applicationId);
}
