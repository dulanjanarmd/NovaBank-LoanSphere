package com.novabank.loansphere.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomerResponse {
    private Long customerId;
    private String nicNumber;
    private String fullName;
    private LocalDate dateOfBirth;
    private String mobileNumber;
    private String email;
    private String address;
    private String occupation;
    private String sourceOfFunds;
    private BigDecimal monthlyTurnover;
    private String riskTier;
    private String status;
    private boolean hasSavingsAccount;
    private LocalDateTime createdAt;

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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
