package com.novabank.loansphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_assessments")
@Data
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
}
