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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final LoanProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/products")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<LoanProduct>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.success(productRepository.findAll()));
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LoanProduct>> createProduct(@RequestBody LoanProduct newProduct) {
        LoanProduct saved = productRepository.save(newProduct);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", saved));
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

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivateProduct(@PathVariable Long id) {
        LoanProduct existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setActive(false);
        productRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Product deactivated successfully", null));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll()));
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody UserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setBranch(request.getBranch());
        user.setActive(true);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", saved));
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setBranch(request.getBranch());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", saved));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully", null));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditLogRepository.findTop100ByOrderByTimestampDesc()));
    }
}

class UserRequest {
    private String username;
    private String password;
    private String fullName;
    private String role;
    private String branch;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
}
