package com.novabank.loansphere.service;

import com.novabank.loansphere.dto.AccountRequest;
import com.novabank.loansphere.dto.AccountResponse;
import com.novabank.loansphere.model.Account;
import com.novabank.loansphere.model.AccountProduct;
import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.repository.AccountProductRepository;
import com.novabank.loansphere.repository.AccountRepository;
import com.novabank.loansphere.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final AccountProductRepository accountProductRepository;

    @Transactional
    public AccountResponse openAccount(AccountRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        AccountProduct product = accountProductRepository.findByName(request.getProductName())
                .orElseThrow(() -> new RuntimeException("Account product not found"));

        Account account = new Account();
        account.setCustomer(customer);
        account.setProductName(product.getName());
        account.setAccountNumber(generateAccountNumber());
        account.setStatus("ACTIVE");

        Account savedAccount = accountRepository.save(account);

        // Update customer hasSavingsAccount flag
        customer.setHasSavingsAccount(true);
        customerRepository.save(customer);

        return mapToResponse(savedAccount);
    }

    public List<AccountResponse> getCustomerAccounts(Long customerId) {
        List<Account> accounts = accountRepository.findByCustomerCustomerId(customerId);
        return accounts.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToResponse(account);
    }

    public List<AccountResponse> getActiveAccountProducts() {
        List<AccountProduct> products = accountProductRepository.findByActiveTrue();
        return products.stream().map(product -> {
            AccountResponse response = new AccountResponse();
            response.setProductName(product.getName());
            response.setStatus(product.isActive() ? "ACTIVE" : "INACTIVE");
            return response;
        }).collect(Collectors.toList());
    }

    private String generateAccountNumber() {
        // Generate 12-digit account number starting with 812
        Random random = new Random();
        String prefix = "812";
        String middle = String.format("%04d", random.nextInt(10000));
        String suffix = String.format("%05d", random.nextInt(100000));
        return prefix + middle + suffix;
    }

    private AccountResponse mapToResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setAccountId(account.getAccountId());
        response.setAccountNumber(account.getAccountNumber());
        response.setProductName(account.getProductName());
        response.setStatus(account.getStatus());
        response.setCreatedAt(account.getCreatedAt());
        return response;
    }
}
