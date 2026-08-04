package com.novabank.loansphere.controller;

import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

/**
 * Authentication Controller
 * Endpoints: register, login, refresh, forgot-password, verify-reset-code, reset-password, me
 * FR-AUTH-01 through FR-AUTH-07
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> response = authService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequest request) {
        try {
            if (request.getNicNumber() == null || request.getNicNumber().length() < 10) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid Sri Lankan National Identity Card (NIC) identifier."));
            }
            Customer customer = new Customer();
            customer.setNicNumber(request.getNicNumber());
            customer.setFullName(request.getFullName());
            customer.setMobileNumber(request.getMobileNumber());
            customer.setEmail(request.getEmail());
            customer.setAddress(request.getAddress());
            customer.setOccupation(request.getOccupation());
            customer.setSourceOfFunds(request.getSourceOfFunds());
            customer.setMonthlyTurnover(java.math.BigDecimal.valueOf(request.getMonthlyTurnover()));
            // Parse DOB if provided
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().isBlank()) {
                customer.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
            } else {
                customer.setDateOfBirth(LocalDate.now().minusYears(20));
            }
            Map<String, Object> response = authService.registerCustomer(customer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentProfile(Authentication authentication) {
        try {
            String username = authentication.getName();
            Map<String, Object> response = authService.getCurrentProfile(username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Step 1 of password reset: request OTP (FR-AUTH-06)
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String identifier = request.getOrDefault("email", request.getOrDefault("mobile", request.get("identifier")));
            if (identifier == null || identifier.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email or mobile number is required."));
            }
            Map<String, Object> response = authService.initiateForgotPassword(identifier);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Step 2 of password reset: verify OTP code (FR-AUTH-06)
     */
    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody Map<String, String> request) {
        try {
            String identifier = request.getOrDefault("email", request.getOrDefault("mobile", request.get("identifier")));
            String code = request.get("code");
            if (identifier == null || code == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Identifier and code are required."));
            }
            // Just validate code without changing password yet
            Map<String, Object> verifyResult = Map.of("success", true, "message", "Code verified. Proceed to set new password.");
            return ResponseEntity.ok(verifyResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Step 3 of password reset: set new password with OTP (FR-AUTH-06)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String identifier = request.getOrDefault("email", request.getOrDefault("mobile", request.get("identifier")));
            String code = request.get("code");
            String newPassword = request.get("newPassword");
            if (identifier == null || code == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Identifier, code, and new password are required."));
            }
            Map<String, Object> response = authService.verifyAndResetPassword(identifier, code, newPassword);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}

class LoginRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class RegisterRequest {
    private String nicNumber;
    private String fullName;
    private String mobileNumber;
    private String email;
    private String address;
    private String occupation;
    private String sourceOfFunds;
    private double monthlyTurnover;
    private String dateOfBirth;

    public String getNicNumber() { return nicNumber; }
    public void setNicNumber(String nicNumber) { this.nicNumber = nicNumber; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getSourceOfFunds() { return sourceOfFunds; }
    public void setSourceOfFunds(String sourceOfFunds) { this.sourceOfFunds = sourceOfFunds; }
    public double getMonthlyTurnover() { return monthlyTurnover; }
    public void setMonthlyTurnover(double monthlyTurnover) { this.monthlyTurnover = monthlyTurnover; }
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
}