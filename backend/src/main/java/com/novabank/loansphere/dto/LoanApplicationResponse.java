package com.novabank.loansphere.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
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
}
