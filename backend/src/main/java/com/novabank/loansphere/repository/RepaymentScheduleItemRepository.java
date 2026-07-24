package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.RepaymentScheduleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentScheduleItemRepository extends JpaRepository<RepaymentScheduleItem, Long> {
    List<RepaymentScheduleItem> findByApplicationApplicationIdOrderByInstallmentNoAsc(Long applicationId);
}
