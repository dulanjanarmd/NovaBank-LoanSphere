package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanProductRepository extends JpaRepository<LoanProduct, Long> {
}
