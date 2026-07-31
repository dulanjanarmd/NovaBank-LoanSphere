package com.novabank.loansphere.controller;

import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.Map;

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
            customer.setDateOfBirth(java.time.LocalDate.now().minusYears(20));

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
}