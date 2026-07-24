package com.novabank.loansphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "nic_number", unique = true, nullable = false, length = 12)
    private String nicNumber;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "mobile_number", unique = true, nullable = false, length = 15)
    private String mobileNumber;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, length = 100)
    private String occupation;

    @Column(name = "source_of_funds", nullable = false, length = 100)
    private String sourceOfFunds;

    @Column(name = "monthly_turnover", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyTurnover = BigDecimal.ZERO;

    @Column(name = "risk_tier", length = 20)
    private String riskTier = "LOW";

    @Column(length = 20)
    private String status = "ACTIVE";

    @Column(name = "has_savings_account")
    private boolean hasSavingsAccount = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
