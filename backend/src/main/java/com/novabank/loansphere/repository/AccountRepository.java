package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByCustomerCustomerId(Long customerId);
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByStatus(String status);
}
