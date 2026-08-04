package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.model.LoanProduct;
import com.novabank.loansphere.model.AccountProduct;
import com.novabank.loansphere.repository.LoanProductRepository;
import com.novabank.loansphere.repository.AccountProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final LoanProductRepository loanProductRepository;
    private final AccountProductRepository accountProductRepository;

    @GetMapping("/loan-products")
    public ResponseEntity<ApiResponse<List<LoanProduct>>> getLoanProducts() {
        return ResponseEntity.ok(ApiResponse.success(loanProductRepository.findAll()));
    }

    @GetMapping("/account-products")
    public ResponseEntity<ApiResponse<List<AccountProduct>>> getAccountProducts() {
        return ResponseEntity.ok(ApiResponse.success(accountProductRepository.findAll()));
    }

    @GetMapping("/branches")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getBranches() {
        List<Map<String, String>> branches = List.of(
                Map.of("code", "B001", "name", "Colombo 01 - Fort", "district", "Colombo"),
                Map.of("code", "B002", "name", "Kandy - Dalada Veediya", "district", "Kandy"),
                Map.of("code", "B003", "name", "Galle - Lighthouse St", "district", "Galle"),
                Map.of("code", "B004", "name", "Jaffna - Hospital Rd", "district", "Jaffna"),
                Map.of("code", "B005", "name", "Negombo - Lewis Peiris Mw", "district", "Gampaha"),
                Map.of("code", "B006", "name", "Matara - Anagarika Dharmapala Mw", "district", "Matara"),
                Map.of("code", "B007", "name", "Kurunegala - Dambulla Rd", "district", "Kurunegala"),
                Map.of("code", "B008", "name", "Gampaha - Yakkuruwela Jct", "district", "Gampaha")
        );
        return ResponseEntity.ok(ApiResponse.success(branches));
    }
}
