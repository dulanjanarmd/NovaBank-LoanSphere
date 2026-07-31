package com.novabank.loansphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_approvals")
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

    // Explicit getters/setters
    public Long getApprovalId() { return approvalId; }
    public void setApprovalId(Long approvalId) { this.approvalId = approvalId; }

    public LoanApplication getApplication() { return application; }
    public void setApplication(LoanApplication application) { this.application = application; }

    public String getApprover() { return approver; }
    public void setApprover(String approver) { this.approver = approver; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getDecidedAt() { return decidedAt; }
}
