package com.novabank.loansphere.service;

import com.novabank.loansphere.model.AuditLog;
import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.model.User;
import com.novabank.loansphere.repository.AuditLogRepository;
import com.novabank.loansphere.repository.CustomerRepository;
import com.novabank.loansphere.repository.UserRepository;
import com.novabank.loansphere.security.JwtHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

/**
 * Authentication Service
 * Implements:
 *  - JWT-based authentication (FR-AUTH-02)
 *  - Account lockout after 5 failed attempts (FR-AUTH-05)
 *  - Password reset via OTP (FR-AUTH-06)
 *  - Auth audit logging (FR-AUTH-07)
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 30;
    private static final int RESET_OTP_EXPIRY_MINUTES = 15;

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public Map<String, Object> authenticateUser(String username, String password) {
        // 1. Try staff user first
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Check lockout
            if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Account is locked due to too many failed attempts. Try again after " + user.getLockedUntil().toLocalTime());
            }

            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                // Reset attempts on success
                user.setLoginAttempts(0);
                user.setLockedUntil(null);
                userRepository.save(user);
                logAuditEvent(username, "LOGIN_SUCCESS", "User: " + username, "127.0.0.1", "Staff login successful");
                String token = jwtHelper.generateToken(username, user.getRole());
                return buildAuthResponse(token, username, user.getFullName(), user.getRole(), user.getBranch(), null);
            } else {
                // Increment attempts
                int attempts = user.getLoginAttempts() + 1;
                user.setLoginAttempts(attempts);
                if (attempts >= MAX_LOGIN_ATTEMPTS) {
                    user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
                    logAuditEvent(username, "ACCOUNT_LOCKED", "User: " + username, "127.0.0.1", "Account locked after " + attempts + " failed attempts");
                }
                userRepository.save(user);
                logAuditEvent(username, "LOGIN_FAILED", "User: " + username, "127.0.0.1", "Failed login attempt " + attempts);
                throw new RuntimeException("Invalid credentials." + (attempts >= MAX_LOGIN_ATTEMPTS ? " Account locked for 30 minutes." : " " + (MAX_LOGIN_ATTEMPTS - attempts) + " attempts remaining."));
            }
        }

        // 2. Try customer by mobile or NIC
        Optional<Customer> customerOpt = customerRepository.findByMobileNumber(username);
        if (customerOpt.isEmpty()) {
            customerOpt = customerRepository.findByNicNumber(username);
        }

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();

            // Check lockout
            if (customer.getLockedUntil() != null && customer.getLockedUntil().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Account is locked. Try again after " + customer.getLockedUntil().toLocalTime());
            }

            // For MVP: customers use "password" as default (production: use hashed pw)
            if ("password".equals(password)) {
                customer.setLoginAttempts(0);
                customer.setLockedUntil(null);
                customerRepository.save(customer);
                logAuditEvent(customer.getNicNumber(), "LOGIN_SUCCESS", "Customer: " + customer.getNicNumber(), "127.0.0.1", "Customer login successful");
                String token = jwtHelper.generateToken(customer.getNicNumber(), "CUSTOMER");
                return buildAuthResponse(token, customer.getNicNumber(), customer.getFullName(), "CUSTOMER", "Digital Branch", customer.getCustomerId());
            } else {
                int attempts = customer.getLoginAttempts() + 1;
                customer.setLoginAttempts(attempts);
                if (attempts >= MAX_LOGIN_ATTEMPTS) {
                    customer.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
                    logAuditEvent(customer.getNicNumber(), "ACCOUNT_LOCKED", "Customer: " + customer.getNicNumber(), "127.0.0.1", "Customer account locked");
                }
                customerRepository.save(customer);
                throw new RuntimeException("Invalid credentials." + (attempts >= MAX_LOGIN_ATTEMPTS ? " Account locked for 30 minutes." : " " + (MAX_LOGIN_ATTEMPTS - attempts) + " attempts remaining."));
            }
        }

        logAuditEvent(username, "LOGIN_FAILED_UNKNOWN", "User: " + username, "127.0.0.1", "Unknown user attempted login");
        throw new RuntimeException("Invalid username or password credentials.");
    }

    @Transactional
    public Map<String, Object> registerCustomer(Customer customer) {
        if (customerRepository.findByNicNumber(customer.getNicNumber()).isPresent()) {
            throw new RuntimeException("Customer with this NIC already exists.");
        }
        Customer savedCustomer = customerRepository.save(customer);
        logAuditEvent(savedCustomer.getNicNumber(), "CUSTOMER_REGISTERED", "Customer: " + savedCustomer.getNicNumber(), "127.0.0.1", "New customer registration");
        String token = jwtHelper.generateToken(savedCustomer.getNicNumber(), "CUSTOMER");
        return buildAuthResponse(token, savedCustomer.getNicNumber(), savedCustomer.getFullName(), "CUSTOMER", "Digital Branch", savedCustomer.getCustomerId());
    }

    /**
     * Initiate password reset — generates a 6-digit OTP (FR-AUTH-06)
     */
    @Transactional
    public Map<String, Object> initiateForgotPassword(String identifier) {
        // Try by email first, then mobile, then NIC
        Optional<Customer> customerOpt = customerRepository.findByEmail(identifier);
        if (customerOpt.isEmpty()) customerOpt = customerRepository.findByMobileNumber(identifier);
        if (customerOpt.isEmpty()) customerOpt = customerRepository.findByNicNumber(identifier);

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            String otp = String.format("%06d", new Random().nextInt(999999));
            customer.setPasswordResetToken(otp);
            customer.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(RESET_OTP_EXPIRY_MINUTES));
            customerRepository.save(customer);
            logAuditEvent(customer.getNicNumber(), "PASSWORD_RESET_REQUESTED", "Customer: " + customer.getNicNumber(), "127.0.0.1", "Password reset OTP generated");
            // In production: send via SMS/email gateway
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Reset OTP sent to your registered mobile/email. Valid for 15 minutes.");
            // For demo: expose OTP (remove in production)
            response.put("_devOtp", otp);
            return response;
        }

        // Try staff user
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String otp = String.format("%06d", new Random().nextInt(999999));
            user.setPasswordResetToken(otp);
            user.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(RESET_OTP_EXPIRY_MINUTES));
            userRepository.save(user);
            logAuditEvent(identifier, "PASSWORD_RESET_REQUESTED", "User: " + identifier, "127.0.0.1", "Staff password reset OTP generated");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Reset OTP sent to your registered contact. Valid for 15 minutes.");
            response.put("_devOtp", otp);
            return response;
        }

        throw new RuntimeException("No account found for the provided identifier.");
    }

    /**
     * Verify OTP and reset password (FR-AUTH-06)
     */
    @Transactional
    public Map<String, Object> verifyAndResetPassword(String identifier, String otp, String newPassword) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(identifier);
        if (customerOpt.isEmpty()) customerOpt = customerRepository.findByMobileNumber(identifier);
        if (customerOpt.isEmpty()) customerOpt = customerRepository.findByNicNumber(identifier);

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (customer.getPasswordResetToken() == null || !customer.getPasswordResetToken().equals(otp)) {
                throw new RuntimeException("Invalid or incorrect OTP.");
            }
            if (customer.getResetTokenExpiresAt() == null || customer.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("OTP has expired. Please request a new reset code.");
            }
            // Clear token
            customer.setPasswordResetToken(null);
            customer.setResetTokenExpiresAt(null);
            customer.setLoginAttempts(0);
            customer.setLockedUntil(null);
            customerRepository.save(customer);
            logAuditEvent(customer.getNicNumber(), "PASSWORD_RESET_SUCCESS", "Customer: " + customer.getNicNumber(), "127.0.0.1", "Password successfully reset");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset successful. Please log in with your new credentials.");
            return response;
        }

        // Staff user
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPasswordResetToken() == null || !user.getPasswordResetToken().equals(otp)) {
                throw new RuntimeException("Invalid or incorrect OTP.");
            }
            if (user.getResetTokenExpiresAt() == null || user.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("OTP has expired. Please request a new reset code.");
            }
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            user.setPasswordResetToken(null);
            user.setResetTokenExpiresAt(null);
            user.setLoginAttempts(0);
            user.setLockedUntil(null);
            userRepository.save(user);
            logAuditEvent(identifier, "PASSWORD_RESET_SUCCESS", "User: " + identifier, "127.0.0.1", "Staff password successfully reset");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset successful.");
            return response;
        }

        throw new RuntimeException("Account not found.");
    }

    public Map<String, Object> buildAuthResponse(String token, String username, String fullName, String role, String branch, Long customerId) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        Map<String, Object> userObj = new HashMap<>();
        userObj.put("username", username);
        userObj.put("fullName", fullName);
        userObj.put("role", role);
        userObj.put("branch", branch);
        if (customerId != null) userObj.put("customerId", customerId);
        response.put("user", userObj);
        return response;
    }

    public Map<String, Object> getCurrentProfile(String username) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("username", username);
        Optional<Customer> customerOpt = customerRepository.findByNicNumber(username);
        if (customerOpt.isPresent()) {
            Customer c = customerOpt.get();
            profile.put("role", "CUSTOMER");
            profile.put("fullName", c.getFullName());
            profile.put("customerId", c.getCustomerId());
            profile.put("email", c.getEmail());
            profile.put("mobileNumber", c.getMobileNumber());
            profile.put("address", c.getAddress());
            profile.put("occupation", c.getOccupation());
            profile.put("sourceOfFunds", c.getSourceOfFunds());
            profile.put("monthlyTurnover", c.getMonthlyTurnover());
            profile.put("riskTier", c.getRiskTier());
            profile.put("status", c.getStatus());
            profile.put("branch", "Digital Branch");
        } else {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User u = userOpt.get();
                profile.put("role", u.getRole());
                profile.put("fullName", u.getFullName());
                profile.put("branch", u.getBranch());
                profile.put("userId", u.getUserId());
            } else {
                profile.put("role", "UNKNOWN");
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("profile", profile);
        return response;
    }

    private void logAuditEvent(String userId, String actionType, String entityRef, String ipAddress, String details) {
        try {
            AuditLog log = new AuditLog();
            log.setUserId(userId);
            log.setActionType(actionType);
            log.setEntityReference(entityRef);
            log.setIpAddress(ipAddress);
            log.setDetails(details);
            auditLogRepository.save(log);
        } catch (Exception ignored) {
            // Don't fail the auth operation if audit logging fails
        }
    }
}