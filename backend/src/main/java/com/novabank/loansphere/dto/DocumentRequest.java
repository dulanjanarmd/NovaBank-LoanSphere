package com.novabank.loansphere.dto;

import lombok.Data;

@Data
public class DocumentRequest {
    private Long applicationId;
    private String name;
    private String url;
}
