package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.dto.ApprovalRequest;
import com.novabank.loansphere.dto.LoanApplicationResponse;
import com.novabank.loansphere.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<LoanApplicationResponse>>> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role) {
        try {
            List<LoanApplicationResponse> applications;
            if (role != null) {
                applications = staffService.getApplicationsByRole(role);
            } else {
                applications = staffService.getApplicationsByStatus(status);
            }
            return ResponseEntity.ok(ApiResponse.success(applications));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> getApplicationDetail(@PathVariable Long applicationId) {
        try {
            LoanApplicationResponse application = staffService.getApplicationDetail(applicationId);
            return ResponseEntity.ok(ApiResponse.success(application));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/applications/{applicationId}/approve")
    public ResponseEntity<ApiResponse<LoanApplicationResponse>> processApproval(
            @PathVariable Long applicationId,
            @RequestBody ApprovalRequest request,
            Authentication authentication) {
        try {
            request.setApplicationId(applicationId);
            String approverName = authentication.getName();
            String approverRole = authentication.getAuthorities().iterator().next().getAuthority();
            LoanApplicationResponse response = staffService.processApproval(request, approverName, approverRole);
            return ResponseEntity.ok(ApiResponse.success("Application processed successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
