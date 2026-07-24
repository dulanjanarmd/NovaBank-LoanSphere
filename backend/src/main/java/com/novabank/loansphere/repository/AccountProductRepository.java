package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.AccountProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountProductRepository extends JpaRepository<AccountProduct, Long> {
    List<AccountProduct> findByActiveTrue();
    Optional<AccountProduct> findByName(String name);
}
