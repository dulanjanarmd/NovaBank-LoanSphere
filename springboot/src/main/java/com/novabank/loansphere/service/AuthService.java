package com.novabank.loansphere.service;

import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.model.User;
import com.novabank.loansphere.repository.CustomerRepository;
import com.novabank.loansphere.repository.UserRepository;
import com.novabank.loansphere.security.JwtHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;

    public Map<String, Object> authenticateUser(String username, String password) {
        // Try user (staff)
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                String token = jwtHelper.generateToken(username, user.getRole());
                return buildAuthResponse(token, username, user.getFullName(), user.getRole(), user.getBranch());
            }
        }

        // Try customer
        Optional<Customer> customerOpt = customerRepository.findByMobileNumber(username);
        if (customerOpt.isEmpty()) {
            customerOpt = customerRepository.findByNicNumber(username);
        }

        // For MVP, customer login checks a mock password "password" since schema has no password field for them
        if (customerOpt.isPresent() && "password".equals(password)) {
            Customer customer = customerOpt.get();
            String token = jwtHelper.generateToken(customer.getNicNumber(), "CUSTOMER");
            return buildAuthResponse(token, customer.getNicNumber(), customer.getFullName(), "CUSTOMER", "Digital Branch");
        }

        throw new RuntimeException("Invalid username or password credentials.");
    }

    public Map<String, Object> registerCustomer(Customer customer) {
        if (customerRepository.findByNicNumber(customer.getNicNumber()).isPresent()) {
            throw new RuntimeException("Customer with this NIC already exists.");
        }
        
        Customer savedCustomer = customerRepository.save(customer);
        String token = jwtHelper.generateToken(savedCustomer.getNicNumber(), "CUSTOMER");
        
        return buildAuthResponse(token, savedCustomer.getNicNumber(), savedCustomer.getFullName(), "CUSTOMER", "Digital Branch");
    }

    private Map<String, Object> buildAuthResponse(String token, String username, String fullName, String role, String branch) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        
        Map<String, Object> userObj = new HashMap<>();
        userObj.put("username", username);
        userObj.put("fullName", fullName);
        userObj.put("role", role);
        userObj.put("branch", branch);
        response.put("user", userObj);
        
        return response;
    }
}
