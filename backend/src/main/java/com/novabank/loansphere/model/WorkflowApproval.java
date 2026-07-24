package com.novabank.loansphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_approvals")
@Data
public class WorkflowApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approval_id")
    private Long approvalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    @Column(nullable = false, length = 100)
    private String approver;

    @Column(nullable = false, length = 30)
    private String role;

    @Column(nullable = false, length = 30)
    private String decision;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comments;

    @Column(name = "decided_at", insertable = false, updatable = false)
    private LocalDateTime decidedAt;
}
