package com.novabank.loansphere.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
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

    // Explicit getters/setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getNicNumber() { return nicNumber; }
    public void setNicNumber(String nicNumber) { this.nicNumber = nicNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getSourceOfFunds() { return sourceOfFunds; }
    public void setSourceOfFunds(String sourceOfFunds) { this.sourceOfFunds = sourceOfFunds; }

    public BigDecimal getMonthlyTurnover() { return monthlyTurnover; }
    public void setMonthlyTurnover(BigDecimal monthlyTurnover) { this.monthlyTurnover = monthlyTurnover; }

    public String getRiskTier() { return riskTier; }
    public void setRiskTier(String riskTier) { this.riskTier = riskTier; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isHasSavingsAccount() { return hasSavingsAccount; }
    public void setHasSavingsAccount(boolean hasSavingsAccount) { this.hasSavingsAccount = hasSavingsAccount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
