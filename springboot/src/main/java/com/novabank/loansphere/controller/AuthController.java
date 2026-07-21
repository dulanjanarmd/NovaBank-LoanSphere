package com.novabank.loansphere.controller;

import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.Data;

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
            customer.setDateOfBirth(java.time.LocalDate.now().minusYears(20)); // Dummy DOB

            Map<String, Object> response = authService.registerCustomer(customer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}

@Data
class LoginRequest {
    private String username;
    private String password;
}

@Data
class RegisterRequest {
    private String nicNumber;
    private String fullName;
    private String mobileNumber;
    private String email;
    private String address;
    private String occupation;
    private String sourceOfFunds;
    private double monthlyTurnover;
}
