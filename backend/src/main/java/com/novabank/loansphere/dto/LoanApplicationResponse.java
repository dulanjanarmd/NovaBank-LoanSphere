package com.novabank.loansphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LoanApplicationResponse {
    private Long applicationId;
    private String applicationRef;
    private String loanType;
    private String productName;
    private BigDecimal requestedAmount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;

    // Customer info
    private String customerName;
    private String customerNic;
    private String customerMobile;

    // Credit assessment
    private Integer internalScore;
    private String cribReference;
    private BigDecimal dtiRatio;
    private BigDecimal ltvRatio;
    private String decisionBand;

    // Branch / officer
    private String branch;
    private String assignedOfficer;

    private boolean slaBreached;

    // Explicit getters/setters
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getApplicationRef() { return applicationRef; }
    public void setApplicationRef(String applicationRef) { this.applicationRef = applicationRef; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }

    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerNic() { return customerNic; }
    public void setCustomerNic(String customerNic) { this.customerNic = customerNic; }

    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

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

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public boolean isSlaBreached() { return slaBreached; }
    public void setSlaBreached(boolean slaBreached) { this.slaBreached = slaBreached; }
}
