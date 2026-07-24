package com.novabank.loansphere.controller;

import com.novabank.loansphere.dto.AccountRequest;
import com.novabank.loansphere.dto.AccountResponse;
import com.novabank.loansphere.dto.ApiResponse;
import com.novabank.loansphere.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/open")
    public ResponseEntity<ApiResponse<AccountResponse>> openAccount(@RequestBody AccountRequest request) {
        try {
            AccountResponse response = accountService.openAccount(request);
            return ResponseEntity.ok(ApiResponse.success("Account opened successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getCustomerAccounts(@PathVariable Long customerId) {
        try {
            List<AccountResponse> accounts = accountService.getCustomerAccounts(customerId);
            return ResponseEntity.ok(ApiResponse.success(accounts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountByNumber(@PathVariable String accountNumber) {
        try {
            AccountResponse account = accountService.getAccountByNumber(accountNumber);
            return ResponseEntity.ok(ApiResponse.success(account));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getActiveProducts() {
        try {
            List<AccountResponse> products = accountService.getActiveAccountProducts();
            return ResponseEntity.ok(ApiResponse.success(products));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
