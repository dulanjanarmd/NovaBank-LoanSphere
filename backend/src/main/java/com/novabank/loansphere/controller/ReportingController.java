package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService reportingService;

    @GetMapping("/kpi")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getKPIMetrics() {
        try {
            Map<String, Object> kpis = reportingService.getKPIMetrics();
            return ResponseEntity.ok(ApiResponse.success(kpis));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/applications-by-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApplicationsByStatus() {
        try {
            Map<String, Object> statusData = reportingService.getApplicationsByStatus();
            return ResponseEntity.ok(ApiResponse.success(statusData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/monthly-disbursements")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyDisbursements() {
        try {
            Map<String, Object> monthlyData = reportingService.getMonthlyDisbursements();
            return ResponseEntity.ok(ApiResponse.success(monthlyData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/product-mix")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductMix() {
        try {
            Map<String, Object> productMix = reportingService.getProductMix();
            return ResponseEntity.ok(ApiResponse.success(productMix));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
