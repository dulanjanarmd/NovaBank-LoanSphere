package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Reporting Controller — SRS endpoints:
 *  GET /api/v1/reports/kpi                 — KPI dashboard metrics
 *  GET /api/v1/reports/applications-by-status
 *  GET /api/v1/reports/monthly-disbursements
 *  GET /api/v1/reports/product-mix
 *  GET /api/v1/reports/operational         — FR-RPT-01 (with filters)
 *  GET /api/v1/reports/compliance          — FR-RPT-02
 *  GET /api/v1/reports/tat                 — Turnaround time analysis
 *  GET /api/v1/reports/export-csv          — FR-UW-06 audit log export
 */
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_BRANCH_MANAGER','ROLE_COMPLIANCE_OFFICER','ROLE_LOAN_OFFICER')")
public class ReportingController {

    private final ReportingService reportingService;

    @GetMapping("/kpi")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getKPIs() {
        return ResponseEntity.ok(ApiResponse.success(reportingService.getKPIMetrics()));
    }

    @GetMapping("/applications-by-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApplicationsByStatus() {
        return ResponseEntity.ok(ApiResponse.success(reportingService.getApplicationsByStatus()));
    }

    @GetMapping("/monthly-disbursements")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyDisbursements() {
        return ResponseEntity.ok(ApiResponse.success(reportingService.getMonthlyDisbursements()));
    }

    @GetMapping("/product-mix")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductMix() {
        return ResponseEntity.ok(ApiResponse.success(reportingService.getProductMix()));
    }

    /**
     * Operational report with date range, loan type, and status filters (FR-RPT-01)
     */
    @GetMapping("/operational")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOperationalReport(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String loanType,
            @RequestParam(required = false) String status) {
        try {
            Map<String, Object> report = reportingService.getOperationalReport(from, to, loanType, status);
            return ResponseEntity.ok(ApiResponse.success(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Compliance report (FR-RPT-02): KYC risk distribution, SLA breaches, conditional approvals
     */
    @GetMapping("/compliance")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COMPLIANCE_OFFICER','ROLE_BRANCH_MANAGER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComplianceReport() {
        try {
            Map<String, Object> report = reportingService.getComplianceReport();
            return ResponseEntity.ok(ApiResponse.success(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * TAT (Turnaround Time) report for application processing efficiency
     */
    @GetMapping("/tat")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTATReport() {
        try {
            Map<String, Object> report = reportingService.getTATReport();
            return ResponseEntity.ok(ApiResponse.success(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * CSV export of audit trail (FR-UW-06)
     */
    @GetMapping("/export-csv")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COMPLIANCE_OFFICER')")
    public ResponseEntity<byte[]> exportAuditCsv(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        try {
            String csv = reportingService.exportAuditLogsCsv(from, to);
            byte[] csvBytes = csv.getBytes();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "audit_log_export.csv");
            return ResponseEntity.ok().headers(headers).body(csvBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
