package com.novabank.loansphere.dto;

public class AccountRequest {
    private Long customerId;
    private String productName;
    private String branch;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
}
