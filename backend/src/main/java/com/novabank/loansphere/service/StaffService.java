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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final LoanApplicationRepository applicationRepository;
    private final WorkflowApprovalRepository approvalRepository;
    private final CustomerRepository customerRepository;
    private final LoanProductRepository productRepository;
    private final CreditAssessmentRepository creditAssessmentRepository;
    private final NotificationService notificationService;

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

        // Maker-checker: prevent self-approval if already processed by same person
        Optional<WorkflowApproval> lastApproval = approvalRepository.findFirstByApplicationApplicationIdOrderByApprovalIdDesc(request.getApplicationId());
        if (lastApproval.isPresent() && lastApproval.get().getApprover().equals(approverName)) {
            throw new RuntimeException("Maker-checker violation: You cannot approve an application you recently processed.");
        }

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
                if (approverRole.equals("BRANCH_MANAGER") || approverRole.equals("ADMIN")) {
                    application.setStatus("APPROVED");
                } else {
                    // Loan Officer forwards to next stage
                    application.setStatus("UNDER_REVIEW");
                }
                break;
            case "APPROVE_CONDITIONAL":
                application.setStatus("APPROVED_CONDITIONAL");
                break;
            case "REJECT":
                application.setStatus("REJECTED");
                break;
            case "RETURN_FOR_INFO":
                application.setStatus("PENDING_DOCS");
                break;
            default:
                throw new RuntimeException("Unknown decision: " + request.getDecision());
        }

        application.setUpdatedAt(LocalDateTime.now());
        LoanApplication updatedApplication = applicationRepository.save(application);
        
        // Trigger notification
        if (application.getCustomer() != null) {
            String title = "Loan Application Update";
            String body = "Your loan application " + application.getApplicationRef() + " status is now: " + application.getStatus().replace("_", " ");
            notificationService.createNotification(application.getCustomer().getCustomerId(), title, body, "LOAN_UPDATE");
        }
        
        return mapToResponse(updatedApplication);
    }

    @Transactional
    public LoanApplicationResponse disburse(Long applicationId, String accountNumber, String officerName) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getStatus().equals("APPROVED") && !application.getStatus().equals("APPROVED_CONDITIONAL")) {
            throw new RuntimeException("Application must be APPROVED before disbursement.");
        }

        application.setStatus("DISBURSED");
        application.setUpdatedAt(LocalDateTime.now());
        LoanApplication updated = applicationRepository.save(application);
        
        // Trigger notification
        if (application.getCustomer() != null) {
            String title = "Loan Disbursed";
            String body = "Your loan application " + application.getApplicationRef() + " has been successfully disbursed to account " + accountNumber + ".";
            notificationService.createNotification(application.getCustomer().getCustomerId(), title, body, "DISBURSEMENT");
        }
        
        return mapToResponse(updated);
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
            case "officer":
                return status.equals("SUBMITTED") || status.equals("UNDER_REVIEW") || status.equals("PENDING_DOCS");
            case "COMPLIANCE_OFFICER":
            case "compliance":
                return status.equals("UNDER_REVIEW") || status.equals("SUBMITTED");
            case "BRANCH_MANAGER":
            case "manager":
                return status.equals("UNDER_REVIEW") || status.equals("APPROVED_CONDITIONAL");
            case "ADMIN":
            case "admin":
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
        response.setSlaBreached(application.isSlaBreached());

        // Interest rate from product
        if (application.getLoanProduct() != null) {
            response.setInterestRate(application.getLoanProduct().getInterestRate());
        }

        // Customer info
        if (application.getCustomer() != null) {
            Customer c = application.getCustomer();
            response.setCustomerName(c.getFullName());
            response.setCustomerNic(c.getNicNumber());
            response.setCustomerMobile(c.getMobileNumber());
        }

        // Credit assessment
        creditAssessmentRepository.findByLoanApplicationApplicationId(application.getApplicationId())
                .ifPresent(ca -> {
                    response.setInternalScore(ca.getInternalScore());
                    response.setCribReference(ca.getCribReference());
                    response.setDtiRatio(ca.getDtiRatio());
                    response.setLtvRatio(ca.getLtvRatio());
                    response.setDecisionBand(ca.getDecisionBand());
                });

        return response;
    }
}
