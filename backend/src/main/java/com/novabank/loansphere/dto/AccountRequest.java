package com.novabank.loansphere.dto;

import lombok.Data;

@Data
public class AccountRequest {
    private Long customerId;
    private String productName;
    private String branch;
}
