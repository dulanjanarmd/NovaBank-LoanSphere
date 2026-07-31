package com.novabank.loansphere.dto;

public class ApprovalRequest {
    private Long applicationId;
    private String decision;
    private String comments;

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
