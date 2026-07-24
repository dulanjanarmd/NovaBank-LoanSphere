package com.novabank.loansphere.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {
    private Long customerId;
    private Long loanProductId;
    private String loanType;
    private BigDecimal requestedAmount;
    private Integer tenureMonths;
    private String purpose;
}
