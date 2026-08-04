package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.ApplicationCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationConditionRepository extends JpaRepository<ApplicationCondition, Long> {
    List<ApplicationCondition> findByApplicationId(Long applicationId);
    boolean existsByApplicationIdAndFulfilledFalse(Long applicationId);
}
