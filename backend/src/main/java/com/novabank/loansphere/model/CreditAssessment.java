package com.novabank.loansphere.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_assessments")
public class CreditAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Long assessmentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private LoanApplication loanApplication;

    @Column(name = "internal_score", nullable = false)
    private Integer internalScore;

    @Column(name = "crib_reference", nullable = false, length = 50)
    private String cribReference;

    @Column(name = "dti_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal dtiRatio;

    @Column(name = "ltv_ratio", precision = 5, scale = 2)
    private BigDecimal ltvRatio;

    @Column(name = "decision_band", nullable = false, length = 30)
    private String decisionBand;

    @Column(name = "assessed_at", insertable = false, updatable = false)
    private LocalDateTime assessedAt;

    // Explicit getters/setters (Lombok disabled due to Java 21 annotation processing issue)
    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public LoanApplication getLoanApplication() { return loanApplication; }
    public void setLoanApplication(LoanApplication loanApplication) { this.loanApplication = loanApplication; }

    public Integer getInternalScore() { return internalScore; }
    public void setInternalScore(Integer internalScore) { this.internalScore = internalScore; }

    public String getCribReference() { return cribReference; }
    public void setCribReference(String cribReference) { this.cribReference = cribReference; }

    public BigDecimal getDtiRatio() { return dtiRatio; }
    public void setDtiRatio(BigDecimal dtiRatio) { this.dtiRatio = dtiRatio; }

    public BigDecimal getLtvRatio() { return ltvRatio; }
    public void setLtvRatio(BigDecimal ltvRatio) { this.ltvRatio = ltvRatio; }

    public String getDecisionBand() { return decisionBand; }
    public void setDecisionBand(String decisionBand) { this.decisionBand = decisionBand; }

    public LocalDateTime getAssessedAt() { return assessedAt; }
}
