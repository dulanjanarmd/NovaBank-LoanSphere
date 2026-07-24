-- ====================================================================
-- NOVABANK LOANSPHERE (DIGITAL ONBOARDING & LOAN ORIGINATION SYSTEM)
-- DATABASE SCHEMA DESIGN & INITIALIZATION SEEDING SCRIPT (MySQL 8.x)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS novabank_loansphere;
USE novabank_loansphere;

-- Disable foreign key checks to allow clean table re-creation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS repayment_schedule_items;
DROP TABLE IF EXISTS disbursements;
DROP TABLE IF EXISTS workflow_approvals;
DROP TABLE IF EXISTS credit_assessments;
DROP TABLE IF EXISTS loan_documents;
DROP TABLE IF EXISTS loan_applications;
DROP TABLE IF EXISTS loan_products;
DROP TABLE IF EXISTS kyc_records;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS account_products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE (Internal staff credentials and access controls)
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL, -- e.g., 'LOAN_OFFICER', 'COMPLIANCE_OFFICER', 'BRANCH_MANAGER', 'ADMIN'
    branch VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CUSTOMERS TABLE (Borrowers and depositors registered online)
CREATE TABLE customers (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nic_number VARCHAR(12) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    source_of_funds VARCHAR(100) NOT NULL,
    monthly_turnover DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    risk_tier VARCHAR(20) DEFAULT 'LOW', -- 'LOW', 'MEDIUM', 'HIGH'
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'PENDING_KYC', 'ACTIVE', 'SUSPENDED'
    has_savings_account BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nic (nic_number),
    INDEX idx_mobile (mobile_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ACCOUNT_PRODUCTS TABLE (Savings account tier metadata)
CREATE TABLE account_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    interest_rate DECIMAL(5,2) NOT NULL,
    min_balance DECIMAL(15,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ACCOUNTS TABLE (Deposit accounts created via DAO)
CREATE TABLE accounts (
    account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(12) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_acc_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. KYC_RECORDS TABLE (e-KYC metadata and biometric matches)
CREATE TABLE kyc_records (
    kyc_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    nic_document_ref VARCHAR(255) NOT NULL, -- Encrypted path
    liveness_match_score DECIMAL(5,2) NOT NULL,
    screening_result VARCHAR(20) DEFAULT 'CLEAR', -- 'CLEAR', 'HIT', 'PENDING'
    verified_by_user VARCHAR(50) DEFAULT NULL,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kyc_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. LOAN_PRODUCTS TABLE (Lending rate catalogs)
CREATE TABLE loan_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_type VARCHAR(20) NOT NULL, -- 'PERSONAL', 'HOME', 'VEHICLE', 'SME'
    name VARCHAR(100) NOT NULL UNIQUE,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    default_tenure INT NOT NULL, -- In months
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. LOAN_APPLICATIONS TABLE (Core pipeline applications)
CREATE TABLE loan_applications (
    application_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_ref VARCHAR(30) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    loan_product_id BIGINT NOT NULL,
    loan_type VARCHAR(20) NOT NULL,
    requested_amount DECIMAL(15,2) NOT NULL,
    tenure_months INT NOT NULL,
    status VARCHAR(30) DEFAULT 'SUBMITTED', -- 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'APPROVED_CONDITIONAL', 'REJECTED', 'SIGNED', 'DISBURSED'
    submitted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE,
    CONSTRAINT fk_loan_prod FOREIGN KEY (loan_product_id) REFERENCES loan_products (id),
    INDEX idx_ref (application_ref)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. LOAN_DOCUMENTS TABLE (Attached supporting pay proof)
CREATE TABLE loan_documents (
    document_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'REJECTED'
    comment VARCHAR(255) DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_app FOREIGN KEY (application_id) REFERENCES loan_applications (application_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. CREDIT_ASSESSMENTS TABLE (Calculated scores & checks)
CREATE TABLE credit_assessments (
    assessment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    internal_score INT NOT NULL, -- 0 to 1000 range
    crib_reference VARCHAR(50) NOT NULL,
    dti_ratio DECIMAL(5,2) NOT NULL,
    ltv_ratio DECIMAL(5,2) DEFAULT NULL,
    decision_band VARCHAR(30) NOT NULL, -- 'AUTO_APPROVE', 'MANUAL_REVIEW', 'AUTO_DECLINE'
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assess_app FOREIGN KEY (application_id) REFERENCES loan_applications (application_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. WORKFLOW_APPROVALS TABLE (Audit trail of staff checks)
CREATE TABLE workflow_approvals (
    approval_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    approver VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    decision VARCHAR(30) NOT NULL, -- 'APPROVE', 'REJECT', 'RETURN_FOR_INFO'
    comments TEXT NOT NULL,
    decided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_approval FOREIGN KEY (application_id) REFERENCES loan_applications (application_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. DISBURSEMENTS TABLE (Core disbursement posting data)
CREATE TABLE disbursements (
    disbursement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    account_number VARCHAR(20) NOT NULL,
    disbursed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cbs_reference VARCHAR(50) NOT NULL,
    CONSTRAINT fk_disb_app FOREIGN KEY (application_id) REFERENCES loan_applications (application_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. REPAYMENT_SCHEDULE_ITEMS (Amortization rows)
CREATE TABLE repayment_schedule_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    installment_no INT NOT NULL,
    due_date DATE NOT NULL,
    emi_amount DECIMAL(15,2) NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_amount DECIMAL(15,2) NOT NULL,
    remaining_balance DECIMAL(15,2) NOT NULL,
    CONSTRAINT fk_repay_app FOREIGN KEY (application_id) REFERENCES loan_applications (application_id) ON DELETE CASCADE,
    INDEX idx_repay_app (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. SYSTEM AUDIT_LOGS TABLE (Security logs)
CREATE TABLE audit_logs (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    entity_reference VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ====================================================================
-- SEED DATA FOR DEMONSTRATION & TESTING
-- ====================================================================

-- Seed Users (Bcrypt hashes for standard 'password')
INSERT INTO users (username, password_hash, full_name, role, branch) VALUES
('officer', '$2a$10$X8m17X1lXm6m1h7k1G1S1e5f8w9x.9G4tBvXzN1QOWeV1P2g5yW/m', 'Aruni Perera', 'LOAN_OFFICER', 'Colombo Fort'),
('compliance', '$2a$10$X8m17X1lXm6m1h7k1G1S1e5f8w9x.9G4tBvXzN1QOWeV1P2g5yW/m', 'Sajith Silva', 'COMPLIANCE_OFFICER', 'Head Office'),
('manager', '$2a$10$X8m17X1lXm6m1h7k1G1S1e5f8w9x.9G4tBvXzN1QOWeV1P2g5yW/m', 'Niranjan Jayawardena', 'BRANCH_MANAGER', 'Colombo Fort'),
('admin', '$2a$10$X8m17X1lXm6m1h7k1G1S1e5f8w9x.9G4tBvXzN1QOWeV1P2g5yW/m', 'Admin Sphere', 'ADMIN', 'Head Office');

-- Seed Savings Account Products
INSERT INTO account_products (name, interest_rate, min_balance) VALUES
('Regular Savings', 3.50, 1000.00),
('Youth Savings (18-25)', 4.50, 500.00),
('Senior Citizens Savings', 5.50, 1000.00);

-- Seed Loan Products
INSERT INTO loan_products (loan_type, name, min_amount, max_amount, interest_rate, default_tenure) VALUES
('PERSONAL', 'Speedy Personal Loan', 50000.00, 1000000.00, 14.50, 36),
('HOME', 'Dream Home Loan', 1000000.00, 25000000.00, 11.20, 180),
('VEHICLE', 'WheelSphere Vehicle Loan', 500000.00, 10000000.00, 12.80, 60),
('SME', 'SME Growth Engine Loan', 1000000.00, 50000000.00, 13.50, 48);

-- Seed Customers
INSERT INTO customers (nic_number, full_name, date_of_birth, mobile_number, email, address, occupation, source_of_funds, monthly_turnover, risk_tier, status, has_savings_account) VALUES
('199234509123', 'Kamal Bandara', '1992-05-14', '+94771234567', 'kamal@gmail.com', 'No. 45, Flower Road, Colombo 07', 'Software Engineer', 'Salary', 250000.00, 'LOW', 'ACTIVE', TRUE),
('198851234567', 'Fathima Rizan', '1988-11-20', '+94719876543', 'fathima@gmail.com', 'No. 12/A, Kandy Road, Kadawatha', 'Business Owner', 'Business Revenue', 800000.00, 'MEDIUM', 'ACTIVE', FALSE);

-- Seed Accounts
INSERT INTO accounts (customer_id, product_name, account_number, status) VALUES
(1, 'Regular Savings', '8120045610', 'ACTIVE');

-- Seed loan applications
INSERT INTO loan_applications (application_ref, customer_id, loan_product_id, loan_type, requested_amount, tenure_months, status, submitted_at) VALUES
('NBLS-LN-PERSONAL-20260710-001', 1, 1, 'PERSONAL', 500000.00, 24, 'DISBURSED', '2026-07-10 11:00:00'),
('NBLS-LN-SME-20260718-002', 2, 4, 'SME', 15000000.00, 60, 'UNDER_REVIEW', '2026-07-18 14:20:00');

-- Seed loan documents
INSERT INTO loan_documents (application_id, name, url, status) VALUES
(1, 'NIC Copy', 'nic_scan.pdf', 'VERIFIED'),
(1, 'Salary Slips', 'payslips.pdf', 'VERIFIED'),
(1, 'Bank Statement', 'statement.pdf', 'VERIFIED'),
(2, 'Business Registration', 'biz_reg.pdf', 'VERIFIED'),
(2, 'Audited Financials', 'financials.pdf', 'PENDING'),
(2, 'Collateral Valuation', 'valuation_v1.pdf', 'REJECTED');

-- Seed credit assessments
INSERT INTO credit_assessments (application_id, internal_score, crib_reference, dti_ratio, ltv_ratio, decision_band) VALUES
(1, 780, 'CRIB-LN-99214A', 28.50, NULL, 'AUTO_APPROVE'),
(2, 620, 'CRIB-LN-88122B', 45.20, 65.00, 'MANUAL_REVIEW');

-- Seed disbursement logs
INSERT INTO disbursements (application_id, account_number, cbs_reference) VALUES
(1, '8120045610', 'CBS-DISB-99824');

-- Seed repayment schedule
INSERT INTO repayment_schedule_items (application_id, installment_no, due_date, emi_amount, principal_amount, interest_amount, remaining_balance) VALUES
(1, 1, '2026-08-10', 24115.00, 18115.00, 6000.00, 481885.00),
(1, 2, '2026-09-10', 24115.00, 18332.00, 5783.00, 463553.00);

-- Seed security logs
INSERT INTO audit_logs (user_id, action_type, entity_reference, ip_address, details) VALUES
('admin', 'SYSTEM_START', 'NovaBank Engine', '127.0.0.1', 'System database schema generated and seeded with standard tables.'),
('officer', 'LOGIN', 'User: officer', '192.168.1.10', 'Staff login successful, granted LOAN_OFFICER credentials.');
