package com.novabank.loansphere.service;

import com.novabank.loansphere.dto.ApprovalRequest;
import com.novabank.loansphere.dto.LoanApplicationResponse;
import com.novabank.loansphere.model.*;
import com.novabank.loansphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final LoanApplicationRepository applicationRepository;
    private final WorkflowApprovalRepository approvalRepository;
    private final CustomerRepository customerRepository;
    private final LoanProductRepository productRepository;

    public List<LoanApplicationResponse> getApplicationsByStatus(String status) {
        List<LoanApplication> applications;
        if (status == null || status.equals("all")) {
            applications = applicationRepository.findAll();
        } else {
            applications = applicationRepository.findByStatus(status);
        }
        return applications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<LoanApplicationResponse> getApplicationsByRole(String role) {
        // Filter applications based on role
        List<LoanApplication> allApplications = applicationRepository.findAll();
        return allApplications.stream()
                .filter(app -> isApplicationAccessibleForRole(app, role))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LoanApplicationResponse processApproval(ApprovalRequest request, String approverName, String approverRole) {
        LoanApplication application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Create workflow approval record
        WorkflowApproval approval = new WorkflowApproval();
        approval.setApplication(application);
        approval.setApprover(approverName);
        approval.setRole(approverRole);
        approval.setDecision(request.getDecision());
        approval.setComments(request.getComments());
        approvalRepository.save(approval);

        // Update application status based on decision
        switch (request.getDecision()) {
            case "APPROVE":
                // Check if this is final approval
                if (approverRole.equals("BRANCH_MANAGER")) {
                    application.setStatus("APPROVED");
                    application.setSubmittedAt(LocalDateTime.now());
                } else {
                    application.setStatus("UNDER_REVIEW");
                }
                break;
            case "REJECT":
                application.setStatus("REJECTED");
                break;
            case "RETURN_FOR_INFO":
                application.setStatus("SUBMITTED");
                break;
        }

        LoanApplication updatedApplication = applicationRepository.save(application);
        return mapToResponse(updatedApplication);
    }

    public LoanApplicationResponse getApplicationDetail(Long applicationId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return mapToResponse(application);
    }

    private boolean isApplicationAccessibleForRole(LoanApplication application, String role) {
        String status = application.getStatus();
        switch (role) {
            case "LOAN_OFFICER":
                return status.equals("SUBMITTED") || status.equals("UNDER_REVIEW");
            case "COMPLIANCE_OFFICER":
                return status.equals("UNDER_REVIEW");
            case "BRANCH_MANAGER":
                return status.equals("UNDER_REVIEW") || status.equals("APPROVED_CONDITIONAL");
            case "ADMIN":
                return true;
            default:
                return false;
        }
    }

    private LoanApplicationResponse mapToResponse(LoanApplication application) {
        LoanApplicationResponse response = new LoanApplicationResponse();
        response.setApplicationId(application.getApplicationId());
        response.setApplicationRef(application.getApplicationRef());
        response.setLoanType(application.getLoanType());
        response.setProductName(application.getLoanProduct() != null ? application.getLoanProduct().getName() : "");
        response.setRequestedAmount(application.getRequestedAmount());
        response.setTenureMonths(application.getTenureMonths());
        response.setStatus(application.getStatus());
        response.setSubmittedAt(application.getSubmittedAt());
        response.setCreatedAt(application.getCreatedAt());
        return response;
    }
}
