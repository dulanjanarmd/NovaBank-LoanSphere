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
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
}
