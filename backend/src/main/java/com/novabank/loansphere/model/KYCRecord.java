package com.novabank.loansphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_records")
@Data
public class KYCRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kyc_id")
    private Long kycId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "nic_document_ref", nullable = false, length = 255)
    private String nicDocumentRef;

    @Column(name = "liveness_match_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal livenessMatchScore;

    @Column(name = "screening_result", length = 20)
    private String screeningResult = "CLEAR";

    @Column(name = "verified_by_user", length = 50)
    private String verifiedByUser;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
