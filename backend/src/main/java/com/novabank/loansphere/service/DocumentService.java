package com.novabank.loansphere.service;

import com.novabank.loansphere.dto.DocumentRequest;
import com.novabank.loansphere.dto.DocumentResponse;
import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.model.LoanDocument;
import com.novabank.loansphere.repository.LoanApplicationRepository;
import com.novabank.loansphere.repository.LoanDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final LoanDocumentRepository documentRepository;
    private final LoanApplicationRepository applicationRepository;

    @Transactional
    public DocumentResponse uploadDocument(DocumentRequest request) {
        LoanApplication application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        LoanDocument document = new LoanDocument();
        document.setApplication(application);
        document.setName(request.getName());
        document.setUrl(request.getUrl());
        document.setStatus("PENDING");

        LoanDocument savedDocument = documentRepository.save(document);
        return mapToResponse(savedDocument);
    }

    public List<DocumentResponse> getApplicationDocuments(Long applicationId) {
        List<LoanDocument> documents = documentRepository.findByApplicationApplicationId(applicationId);
        return documents.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public DocumentResponse updateDocumentStatus(Long documentId, String status, String comment) {
        LoanDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setStatus(status);
        if (comment != null) {
            document.setComment(comment);
        }

        LoanDocument updatedDocument = documentRepository.save(document);
        return mapToResponse(updatedDocument);
    }

    private DocumentResponse mapToResponse(LoanDocument document) {
        DocumentResponse response = new DocumentResponse();
        response.setDocumentId(document.getDocumentId());
        response.setName(document.getName());
        response.setUrl(document.getUrl());
        response.setStatus(document.getStatus());
        response.setComment(document.getComment());
        response.setUpdatedAt(document.getUpdatedAt());
        return response;
    }
}
