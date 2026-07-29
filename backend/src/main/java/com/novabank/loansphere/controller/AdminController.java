package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.model.LoanProduct;
import com.novabank.loansphere.repository.LoanProductRepository;
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
}
