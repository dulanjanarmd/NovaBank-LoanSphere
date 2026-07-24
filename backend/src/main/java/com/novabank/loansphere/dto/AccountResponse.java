package com.novabank.loansphere.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AccountResponse {
    private Long accountId;
    private String accountNumber;
    private String productName;
    private String status;
    private LocalDateTime createdAt;
}
