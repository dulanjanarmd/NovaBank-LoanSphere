package com.novabank.loansphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Application condition entity for conditional approvals (FR-UW-04).
 * Each condition must be fulfilled before disbursement is enabled.
 */
@Entity
@Table(name = "application_conditions")
public class ApplicationCondition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condition_id")
    private Long conditionId;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "fulfilled", nullable = false)
    private boolean fulfilled = false;

    @Column(name = "fulfilled_by", length = 100)
    private String fulfilledBy;

    @Column(name = "fulfilled_at")
    private LocalDateTime fulfilledAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getConditionId() { return conditionId; }
    public void setConditionId(Long conditionId) { this.conditionId = conditionId; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isFulfilled() { return fulfilled; }
    public void setFulfilled(boolean fulfilled) { this.fulfilled = fulfilled; }

    public String getFulfilledBy() { return fulfilledBy; }
    public void setFulfilledBy(String fulfilledBy) { this.fulfilledBy = fulfilledBy; }

    public LocalDateTime getFulfilledAt() { return fulfilledAt; }
    public void setFulfilledAt(LocalDateTime fulfilledAt) { this.fulfilledAt = fulfilledAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
