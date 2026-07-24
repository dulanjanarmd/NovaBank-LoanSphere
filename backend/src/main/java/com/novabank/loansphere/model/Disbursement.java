package com.novabank.loansphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "disbursements")
@Data
public class Disbursement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disbursement_id")
    private Long disbursementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private LoanApplication application;

    @Column(name = "account_number", nullable = false, length = 20)
    private String accountNumber;

    @Column(name = "disbursed_at", insertable = false, updatable = false)
    private LocalDateTime disbursedAt;

    @Column(name = "cbs_reference", nullable = false, length = 50)
    private String cbsReference;
}
