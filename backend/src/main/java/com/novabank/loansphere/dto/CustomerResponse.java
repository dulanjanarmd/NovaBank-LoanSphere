package com.novabank.loansphere.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CustomerResponse {
    private Long customerId;
    private String nicNumber;
    private String fullName;
    private LocalDate dateOfBirth;
    private String mobileNumber;
    private String email;
    private String address;
    private String occupation;
    private String sourceOfFunds;
    private BigDecimal monthlyTurnover;
    private String riskTier;
    private String status;
    private boolean hasSavingsAccount;
    private LocalDateTime createdAt;
}
