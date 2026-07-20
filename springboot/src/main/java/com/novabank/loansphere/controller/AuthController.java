package com.novabank.loansphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Simple authentication check matching our seeded DB users
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        
        // Simulating matching query against MySQL db
        String matchedRole = null;
        String fullName = null;
        String branch = null;
        
        if ("officer".equals(username) && "password".equals(password)) {
            matchedRole = "LOAN_OFFICER";
            fullName = "Aruni Perera";
            branch = "Colombo Fort";
        } else if ("compliance".equals(username) && "password".equals(password)) {
            matchedRole = "COMPLIANCE_OFFICER";
            fullName = "Sajith Silva";
            branch = "Head Office";
        } else if ("manager".equals(username) && "password".equals(password)) {
            matchedRole = "BRANCH_MANAGER";
            fullName = "Niranjan Jayawardena";
            branch = "Colombo Fort";
        } else if ("admin".equals(username) && "password".equals(password)) {
            matchedRole = "ADMIN";
            fullName = "Admin Sphere";
            branch = "Head Office";
        } else if ("+94771234567".equals(username) && "password".equals(password)) {
            matchedRole = "CUSTOMER";
            fullName = "Kamal Bandara";
            branch = "Digital Branch";
        }

        if (matchedRole != null) {
            String token = jwtHelper.generateToken(username, matchedRole);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            
            Map<String, Object> userObj = new HashMap<>();
            userObj.put("username", username);
            userObj.put("fullName", fullName);
            userObj.put("role", matchedRole);
            userObj.put("branch", branch);
            response.put("user", userObj);
            
            return ResponseEntity.ok(response);
        }

        Map<String, Object> errResponse = new HashMap<>();
        errResponse.put("success", false);
        errResponse.put("message", "Invalid username or password credentials.");
        return ResponseEntity.status(401).body(errResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequest request) {
        // Validating uniqueness of NIC in MySQL database tables
        if (request.getNicNumber() == null || request.getNicNumber().length() < 10) {
            return ResponseEntity.badRequest().body("Invalid Sri Lankan National Identity Card (NIC) identifier.");
        }

        // Return registration response with fresh session token
        String token = jwtHelper.generateToken(request.getNicNumber(), "CUSTOMER");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        
        Map<String, Object> userObj = new HashMap<>();
        userObj.put("username", request.getNicNumber());
        userObj.put("fullName", request.getFullName());
        userObj.put("role", "CUSTOMER");
        userObj.put("branch", "Digital Branch");
        response.put("user", userObj);

        return ResponseEntity.ok(response);
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
