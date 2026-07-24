package com.novabank.loansphere.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentResponse {
    private Long documentId;
    private String name;
    private String url;
    private String status;
    private String comment;
    private LocalDateTime updatedAt;
}
