package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.dto.DocumentRequest;
import com.novabank.loansphere.dto.DocumentResponse;
import com.novabank.loansphere.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(@RequestBody DocumentRequest request) {
        try {
            DocumentResponse response = documentService.uploadDocument(request);
            return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getApplicationDocuments(@PathVariable Long applicationId) {
        try {
            List<DocumentResponse> documents = documentService.getApplicationDocuments(applicationId);
            return ResponseEntity.ok(ApiResponse.success(documents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{documentId}/status")
    public ResponseEntity<ApiResponse<DocumentResponse>> updateDocumentStatus(
            @PathVariable Long documentId,
            @RequestParam String status,
            @RequestParam(required = false) String comment) {
        try {
            DocumentResponse response = documentService.updateDocumentStatus(documentId, status, comment);
            return ResponseEntity.ok(ApiResponse.success("Document status updated", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
