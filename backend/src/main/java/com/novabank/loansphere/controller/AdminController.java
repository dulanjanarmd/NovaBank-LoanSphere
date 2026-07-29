package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.model.LoanProduct;
import com.novabank.loansphere.repository.LoanProductRepository;
import com.novabank.loansphere.model.User;
import com.novabank.loansphere.repository.UserRepository;
import com.novabank.loansphere.model.AuditLog;
import com.novabank.loansphere.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final LoanProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/products")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<LoanProduct>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.success(productRepository.findAll()));
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LoanProduct>> updateProduct(
            @PathVariable Long id,
            @RequestBody LoanProduct updatedProduct) {
        
        LoanProduct existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
                
        existing.setName(updatedProduct.getName());
        existing.setMinAmount(updatedProduct.getMinAmount());
        existing.setMaxAmount(updatedProduct.getMaxAmount());
        existing.setInterestRate(updatedProduct.getInterestRate());
        existing.setDefaultTenure(updatedProduct.getDefaultTenure());
        existing.setActive(updatedProduct.isActive());
        
        LoanProduct saved = productRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", saved));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll()));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditLogRepository.findTop100ByOrderByTimestampDesc()));
    }
}
