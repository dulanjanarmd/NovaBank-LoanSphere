package com.novabank.loansphere.dto;

import java.time.LocalDateTime;

public class DocumentResponse {
    private Long documentId;
    private String name;
    private String url;
    private String status;
    private String comment;
    private LocalDateTime updatedAt;

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
