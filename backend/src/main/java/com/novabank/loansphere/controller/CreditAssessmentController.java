package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.model.CreditAssessment;
import com.novabank.loansphere.service.CreditAssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/credit-assessment")
@RequiredArgsConstructor
public class CreditAssessmentController {

    private final CreditAssessmentService assessmentService;

    @PostMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<CreditAssessment>> performAssessment(@PathVariable Long applicationId) {
        try {
            CreditAssessment assessment = assessmentService.performCreditAssessment(applicationId);
            return ResponseEntity.ok(ApiResponse.success("Credit assessment completed", assessment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<CreditAssessment>> getAssessment(@PathVariable Long applicationId) {
        try {
            CreditAssessment assessment = assessmentService.getAssessmentByApplicationId(applicationId);
            return ResponseEntity.ok(ApiResponse.success(assessment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
