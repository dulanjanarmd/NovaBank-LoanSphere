package com.novabank.loansphere.dto;

import lombok.Data;

@Data
public class ApprovalRequest {
    private Long applicationId;
    private String decision; // APPROVE, REJECT, RETURN_FOR_INFO
    private String comments;
}
