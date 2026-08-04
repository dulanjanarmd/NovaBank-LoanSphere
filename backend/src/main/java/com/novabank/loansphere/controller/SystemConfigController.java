package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.model.SystemConfig;
import com.novabank.loansphere.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * System Configuration Controller (FR-ADM-03)
 * GET  /api/v1/admin/config        — list all config
 * PUT  /api/v1/admin/config/{key}  — update single key
 * PUT  /api/v1/admin/config/bulk   — update multiple keys
 */
@RestController
@RequestMapping("/api/v1/admin/config")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class SystemConfigController {

    private final SystemConfigService configService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SystemConfig>>> getAllConfig() {
        try {
            return ResponseEntity.ok(ApiResponse.success(configService.getAllConfigs()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{key}")
    public ResponseEntity<ApiResponse<SystemConfig>> updateConfig(
            @PathVariable String key,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        try {
            String value = body.get("value");
            if (value == null || value.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Config value is required."));
            }
            SystemConfig updated = configService.updateConfig(key, value, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Configuration updated.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/bulk")
    public ResponseEntity<ApiResponse<String>> bulkUpdateConfig(
            @RequestBody Map<String, String> updates,
            Authentication authentication) {
        try {
            configService.bulkUpdate(updates, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("All configurations updated successfully.", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
