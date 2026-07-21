# Software Requirements Specification (SRS)

# NovaBank-LoanSphere
## Digital Loan Origination and Account Opening System

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Draft for Review |
| **Prepared For** | NovaBank (Illustrative Sri Lankan Licensed Commercial Bank) |
| **Standard Followed** | IEEE Std 830-1998 / ISO/IEC/IEEE 29148-2018 |
| **Classification** | Confidential – Internal Use Only |
| **Date** | 17 July 2026 |

### Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | — | Business Analysis Team | Initial draft structure |
| 1.0 | 17 July 2026 | Business Analysis Team | Complete SRS for stakeholder review |

---

## Table of Contents

1. Introduction
2. Overall Description
3. Specific Requirements
4. System Features / Use Cases
5. Data Requirements
6. External Interfaces
7. Other Requirements

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for **NovaBank-LoanSphere**, a web-based Digital Loan Origination and Account Opening System designed for licensed commercial and specialized banks operating in Sri Lanka. The document is intended for use by the project sponsor, business stakeholders, solution architects, development and QA teams, compliance and risk officers, and auditors. It serves as the authoritative baseline for design, development, testing, and regulatory sign-off (CBSL compliance review).

This SRS is written to be sufficiently detailed to support:
- Functional and technical design (backend, frontend, database, integrations)
- Estimation, sprint planning, and traceability of requirements to test cases
- Internal audit and Central Bank of Sri Lanka (CBSL) regulatory review
- Vendor/implementation partner evaluation, if outsourced

## 1.2 Scope

**NovaBank-LoanSphere** is a customer-facing and staff-facing digital platform that enables:

- **Digital Account Opening (DAO):** End-to-end online onboarding of new individual customers, including e-KYC, document verification, and account activation, without requiring an initial branch visit (subject to CBSL final-mile verification rules).
- **Digital Loan Origination (DLO):** Online application, credit assessment, underwriting, approval, e-signature, and disbursement for four loan products: **Personal Loans, Home Loans, Vehicle Loans, and SME Loans**.
- **Staff Workflow Tools:** Dashboards for Loan Officers, Compliance/AML Officers, Branch Managers, and System Administrators to review, verify, score, approve/reject, and disburse applications.
- **Compliance Enforcement:** Built-in KYC/AML checks, sanctions/PEP screening hooks, document retention, and full audit trails aligned with CBSL Banking Act Directions and the FIU (Financial Intelligence Unit) AML/CFT framework.

### 1.2.1 In-Scope (MVP) Features

| # | Feature Area | MVP Included |
|---|---|---|
| 1 | Customer self-registration & login (JWT-based) | Yes |
| 2 | e-KYC: NIC OCR capture, liveness/selfie check, document upload | Yes |
| 3 | Digital savings account opening (individual, resident) | Yes |
| 4 | Loan application wizard — Personal, Home, Vehicle, SME | Yes |
| 5 | Automated credit scoring (rule-based + bureau integration stub) | Yes |
| 6 | Manual underwriting workflow with maker-checker approval | Yes |
| 7 | Document management & e-signature (consent-based e-sign) | Yes |
| 8 | Loan disbursement trigger to Core Banking System (CBS) via API | Yes |
| 9 | Admin dashboard: user, role, product, workflow configuration | Yes |
| 10 | SMS/Email notifications at key milestones | Yes |
| 11 | Reporting & analytics (operational, compliance) | Yes |
| 12 | Multi-branch support & branch manager oversight | Yes |
| 13 | Audit logging of all sensitive actions | Yes |

### 1.2.2 Out-of-Scope (Future Phases)

- Joint/corporate account opening beyond sole-proprietor SME
- Full biometric fingerprint integration with DRP (Department for Registration of Persons)
- Real-time integration with CRIB (Credit Information Bureau of Sri Lanka) production API (MVP uses a certified mock/stub interface)
- Video KYC with live agent
- Mobile native apps (iOS/Android) — MVP is responsive web only
- Islamic banking (Shariah-compliant) loan products
- Multi-currency / cross-border remittance-linked lending

## 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| CBSL | Central Bank of Sri Lanka |
| KYC | Know Your Customer |
| AML | Anti-Money Laundering |
| CFT | Countering the Financing of Terrorism |
| FIU | Financial Intelligence Unit (Sri Lanka) |
| CRIB | Credit Information Bureau of Sri Lanka |
| PEP | Politically Exposed Person |
| NIC | National Identity Card (Sri Lanka) |
| CBS | Core Banking System |
| DLO | Digital Loan Origination |
| DAO | Digital Account Opening |
| e-KYC | Electronic Know Your Customer verification |
| OCR | Optical Character Recognition |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |
| MFA | Multi-Factor Authentication |
| SLA | Service Level Agreement |
| PDPA | Personal Data Protection Act No. 9 of 2022 (Sri Lanka) |
| DTI | Debt-to-Income Ratio |
| LTV | Loan-to-Value Ratio |
| API | Application Programming Interface |
| OWASP | Open Web Application Security Project |
| UAT | User Acceptance Testing |
| SME | Small and Medium Enterprise |

## 1.4 References

1. Central Bank of Sri Lanka – Banking Act Directions No. 11 of 2018 on Customer Due Diligence Rules.
2. Financial Intelligence Unit (FIU) Sri Lanka – AML/CFT Guidelines for Licensed Banks.
3. Personal Data Protection Act No. 9 of 2022, Sri Lanka.
4. Central Bank of Sri Lanka – Directions on Digital Onboarding of Customers (CBSL Guidelines on e-KYC).
5. Credit Information Bureau of Sri Lanka (CRIB) – Data Submission and Enquiry Standards.
6. OWASP Top 10 (2021) and OWASP Application Security Verification Standard (ASVS) v4.0.
7. IEEE Std 830-1998 – Recommended Practice for Software Requirements Specifications.
8. ISO/IEC/IEEE 29148:2018 – Systems and Software Engineering – Requirements Engineering.
9. ISO/IEC 27001:2013 – Information Security Management Systems.
10. Payment Card Industry Data Security Standard (PCI-DSS) v4.0 (for card-linked disbursement, future phase reference).

## 1.5 Overview

Section 2 provides a high-level description of the product, its users, and constraints. Section 3 details functional and non-functional requirements. Section 4 presents formal use cases. Section 5 defines the data model and dictionary. Section 6 specifies external interfaces. Section 7 covers future enhancements and risk management.

---

# 2. Overall Description

## 2.1 Product Perspective

NovaBank-LoanSphere is a new, standalone digital channel that sits alongside (not replacing) the bank's existing branch network and Core Banking System (CBS). It is architected as a modern **three-tier web application**:

- **Presentation Tier:** React.js single-page application (SPA), mobile-first responsive design, consumed by customers (public portal) and staff (secured internal portal).
- **Application/Service Tier:** Spring Boot microservice-oriented REST APIs handling business logic — authentication, KYC orchestration, loan origination workflow, credit scoring, notifications, and reporting.
- **Data Tier:** MySQL relational database as the system of record for application data, with the bank's CBS remaining the system of record for actual account/ledger balances.

NovaBank-LoanSphere integrates with, but does not replace:
- The bank's **Core Banking System (CBS)** — account creation, disbursement postings.
- **CRIB** — credit bureau enquiry.
- **National/Third-party e-KYC or document verification service** — NIC validation, liveness detection.
- **SMS Gateway and Email (SMTP/Transactional Email Provider)**.
- **Sanctions/PEP screening provider** (for AML watch-list checks).

```
                    ┌─────────────────────────┐
                    │   React.js Frontend      │
                    │ (Customer & Staff Portal)│
                    └────────────┬─────────────┘
                                 │ HTTPS / REST (JSON)
                    ┌────────────▼─────────────┐
                    │   Spring Boot API Layer   │
                    │  (Auth, KYC, Loan, Score, │
                    │   Workflow, Notify, Report)│
                    └───┬─────────┬──────────┬──┘
                        │         │          │
              ┌─────────▼──┐ ┌────▼─────┐ ┌──▼───────────┐
              │   MySQL    │ │  CBS API │ │ 3rd-Party APIs│
              │ (App Data) │ │ Gateway  │ │ CRIB/eKYC/SMS │
              └────────────┘ └──────────┘ └──────────────┘
```

## 2.2 Product Functions (High-Level Summary)

| Function Group | Description |
|---|---|
| Identity & Access Management | Registration, login, JWT session management, RBAC for 5 user classes |
| Digital Account Opening | Guided onboarding, e-KYC, product selection, account activation |
| Loan Origination | Multi-step application wizard per loan type, document capture |
| Credit Assessment | Automated scoring engine + bureau data + officer override |
| Underwriting & Approval | Maker-checker workflow, conditional approvals, escalation |
| Document & e-Signature | Secure upload, versioning, consent-based digital signing |
| Disbursement | Trigger to CBS, repayment schedule generation |
| Administration | Product/workflow/user configuration, audit trail |
| Notifications | SMS/email at defined workflow milestones |
| Reporting & Analytics | Operational, compliance (CTR/STR support), MIS dashboards |

## 2.3 User Classes and Characteristics

| User Class | Description | Technical Proficiency | Key Needs |
|---|---|---|---|
| **Customer (Applicant)** | Retail individual or SME sole-proprietor applying for an account/loan via web or mobile browser | Low–Medium | Simple, guided, transparent, mobile-friendly flows; status visibility |
| **Loan Officer** | Front-line bank staff reviewing applications, requesting documents, performing initial assessment | Medium | Efficient queue management, clear applicant data, decision support |
| **Compliance / AML Officer** | Reviews KYC/AML flags, sanctions/PEP hits, approves high-risk cases | Medium–High | Risk indicators, audit trails, case notes, escalation tools |
| **Branch Manager** | Approves loans within delegated authority, oversees branch-level pipeline | Medium | Dashboards, approval queues, portfolio visibility |
| **System Administrator** | Configures products, roles, workflow rules, integrations; manages users | High | Full configuration control, system health monitoring, audit logs |

## 2.4 Operating Environment

| Layer | Specification |
|---|---|
| Client | Modern browsers (Chrome, Edge, Safari, Firefox – latest 2 versions); responsive down to 360px width (mobile) |
| Frontend Runtime | React.js (JavaScript, ES2022+), served via CDN/static hosting or containerized Nginx |
| Backend Runtime | Java 17+ (LTS), Spring Boot 3.x, deployed as Docker containers |
| Database | MySQL 8.x, InnoDB engine, UTF-8MB4 |
| API Documentation | Swagger / OpenAPI 3.0 |
| Build Tooling | Maven (backend), npm/yarn (frontend) |
| Deployment | Docker-ready containers, orchestration-ready (Kubernetes-compatible), on-prem or CBSL-approved cloud region |
| Authentication | JWT (stateless), Spring Security, refresh-token rotation |

## 2.5 Design and Implementation Constraints

- Backend **must** be implemented in **Java using Spring Boot**, exposing **stateless REST APIs** secured by **Spring Security** with **JWT** bearer tokens.
- Persistence layer **must** use **JPA/Hibernate** against a **MySQL** database.
- Frontend **must** be built in **React.js (JavaScript)**, mobile-first, WCAG 2.1 AA accessible.
- All services **must** be **Docker-ready** (Dockerfile + docker-compose for local/dev), supporting future container orchestration.
- All APIs **must** be documented via **Swagger/OpenAPI**, versioned (`/api/v1/...`).
- All customer PII and KYC documents **must** be encrypted at rest (AES-256) and in transit (TLS 1.2+).
- The system **must not** store full NIC images or biometric templates beyond the retention period mandated by CBSL/FIU directions.
- The system must support **data residency** — production data must reside within infrastructure approved for Sri Lankan banking use (on-prem or CBSL-sanctioned cloud).
- Build/dependency management via **Maven** (backend) — no unmanaged JARs.
- All monetary calculations **must** use fixed-point/`BigDecimal` arithmetic — floating-point types are prohibited for financial values.

## 2.6 Assumptions and Dependencies

- CBSL permits fully digital onboarding for a defined risk tier (e.g., low-value savings accounts) subject to enhanced due diligence for higher tiers.
- The bank's CRIB access credentials and CBS API endpoints will be provisioned by the bank's IT department prior to integration testing; MVP integrates against a certified sandbox/stub.
- A licensed e-KYC/liveness-detection vendor (e.g., NIC OCR + selfie liveness) will be procured and its API made available; NovaBank-LoanSphere integrates via an abstraction layer to allow vendor substitution.
- SMS and email gateway accounts (transactional, DLT-compliant where applicable) are provisioned by the bank.
- Final in-person or video verification for higher-risk/higher-value onboarding remains a CBSL-mandated control until regulations permit fully paperless onboarding for all tiers.
- Users have access to a smartphone or webcam-enabled device for document capture and liveness check.
- The bank retains ultimate lending decision authority per its Board-approved credit policy; NovaBank-LoanSphere enforces workflow, not policy authorship.

---

# 3. Specific Requirements

Requirements are identified using the pattern **FR-[Module]-[Number]** for functional and **NFR-[Category]-[Number]** for non-functional requirements, to support traceability into test cases.

## 3.1 Functional Requirements

### 3.1.1 Module: User Authentication & Authorization

**User Story:** *As a customer or staff member, I want to securely register/log in so that I can access features appropriate to my role.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-AUTH-01 | The system shall allow customers to self-register using NIC number, mobile number, and email, verified via OTP. | Registration fails if NIC format is invalid or OTP is not verified within 5 minutes. |
| FR-AUTH-02 | The system shall authenticate all users via JWT-based login (username/NIC + password, or staff username + password). | On valid credentials, an access token (15 min expiry) and refresh token (7 days) are issued. |
| FR-AUTH-03 | The system shall enforce Multi-Factor Authentication (OTP via SMS/email) for staff roles and for high-value transactions. | MFA challenge triggered on staff login and on loan approvals above configurable threshold. |
| FR-AUTH-04 | The system shall implement Role-Based Access Control (RBAC) for 5 roles: Customer, Loan Officer, Compliance Officer, Branch Manager, Admin. | A user assigned "Loan Officer" cannot access Admin configuration endpoints (HTTP 403). |
| FR-AUTH-05 | The system shall lock an account after 5 consecutive failed login attempts for 30 minutes. | 6th failed attempt returns account-locked message; unlock automatically after cooldown or via Admin. |
| FR-AUTH-06 | The system shall allow password reset via OTP-verified mobile/email flow. | Reset link/OTP expires in 15 minutes; old password invalidated immediately upon reset. |
| FR-AUTH-07 | The system shall log all authentication events (success, failure, lockout) to the audit log with timestamp, IP, and device metadata. | Each event is queryable in the audit log within 5 seconds of occurrence. |

### 3.1.2 Module: Customer Registration & Digital Account Opening

**User Story:** *As a customer, I want to open a savings account fully online so that I don't need to visit a branch.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-DAO-01 | The system shall present a guided, multi-step account opening wizard: (1) Personal Details, (2) e-KYC, (3) Product Selection, (4) Terms & Consent, (5) Review & Submit. | Customer cannot proceed to next step until current step's mandatory fields pass validation. |
| FR-DAO-02 | The system shall capture mandatory customer fields: full name (per NIC), NIC number, DOB, address, occupation, source of funds, expected monthly turnover. | All fields listed are enforced as mandatory before submission; NIC checksum validated. |
| FR-DAO-03 | The system shall allow selection from configurable savings account products (e.g., regular savings, minor's account — resident adults only in MVP). | Only products marked "active" by Admin are shown to the customer. |
| FR-DAO-04 | The system shall capture explicit customer consent for data processing (PDPA) and terms & conditions before submission. | Submission is blocked unless consent checkbox(es) are affirmatively checked and logged with timestamp. |
| FR-DAO-05 | The system shall generate a unique application reference number upon submission and display it to the customer. | Reference number format: `NBLS-DAO-YYYYMMDD-XXXXX`, unique and immutable. |
| FR-DAO-06 | The system shall route submitted account applications to a Loan/Onboarding Officer queue for KYC and CDD (Customer Due Diligence) review. | Application appears in officer's queue within 1 minute of submission. |
| FR-DAO-07 | Upon approval, the system shall trigger account creation via the Core Banking System (CBS) integration API and return the generated account number to the customer. | Account number displayed/notified to customer within defined SLA; failure triggers retry + alert to Admin. |

### 3.1.3 Module: e-KYC / Identity Verification

**User Story:** *As a compliance-conscious bank, I want every applicant's identity verified electronically so that we meet CBSL/FIU CDD requirements.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-KYC-01 | The system shall allow customers to upload a photo/scan of their NIC (front and back) via web camera or file upload (JPEG/PNG/PDF, max 5MB). | Upload rejected if format/size invalid; preview shown before submission. |
| FR-KYC-02 | The system shall extract NIC fields (name, NIC number, DOB, address) via OCR integration and pre-fill the registration form for customer confirmation. | Extracted fields are editable; customer must confirm accuracy before proceeding. |
| FR-KYC-03 | The system shall perform a liveness check (selfie capture with basic liveness cues, e.g., blink/head-turn prompt) and match the selfie against the NIC photo via the integrated e-KYC vendor API. | Match score below configurable threshold routes application to manual review instead of auto-reject. |
| FR-KYC-04 | The system shall screen the applicant's name against sanctions and PEP watch-lists via an integrated screening service. | A "hit" (exact or fuzzy match above threshold) flags the application as "High Risk – Compliance Review Required" and blocks auto-approval. |
| FR-KYC-05 | The system shall classify each applicant into a risk tier (Low / Medium / High) based on configurable rules (nationality, occupation, transaction profile, PEP/sanctions result). | Risk tier is stored, displayed to Compliance Officer, and drives required due-diligence depth. |
| FR-KYC-06 | The system shall retain KYC documents in encrypted storage for the CBSL/FIU-mandated retention period (configurable, default 6 years) and support secure deletion thereafter. | Documents inaccessible outside authorized roles; retention job logs deletion actions. |
| FR-KYC-07 | The system shall allow a Compliance Officer to manually approve, reject, or request additional documents for any KYC case, with mandatory comments. | Rejection/RFI (request for information) cannot be submitted without a comment; customer notified automatically. |

### 3.1.4 Module: Loan Application (Multi-Step Wizard)

**User Story:** *As a customer, I want to apply for a Personal/Home/Vehicle/SME loan through a guided online process so that I can complete it without paperwork.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-LOAN-01 | The system shall provide a loan-type selector (Personal, Home, Vehicle, SME), each launching a tailored multi-step wizard. | Selecting a type loads product-specific fields, document checklist, and eligibility rules. |
| FR-LOAN-02 | The system shall capture common loan fields: requested amount, tenure, purpose, income details, existing liabilities. | Requested amount validated against product min/max configured by Admin. |
| FR-LOAN-03 | The system shall capture loan-type-specific fields: <br>• Home Loan – property value, location, LTV inputs <br>• Vehicle Loan – vehicle type, make/model, dealer, market value <br>• SME Loan – business registration no., annual turnover, years in operation <br>• Personal Loan – employment type, employer details | Each loan type's wizard step enforces its specific mandatory fields before proceeding. |
| FR-LOAN-04 | The system shall display a real-time, indicative loan checklist of required supporting documents based on loan type and employment category. | Checklist updates dynamically as customer changes loan type/employment category. |
| FR-LOAN-05 | The system shall allow customers to save an in-progress application as a draft and resume later. | Draft persists for 30 days; resuming restores all previously entered data. |
| FR-LOAN-06 | The system shall calculate and display an indicative EMI (Equated Monthly Installment) using entered amount, tenure, and applicable interest rate before submission. | EMI calculation uses `BigDecimal` precision and matches the finance-approved amortization formula. |
| FR-LOAN-07 | Upon submission, the system shall generate a unique loan application reference and route it to the Credit Assessment stage. | Reference format: `NBLS-LN-[TYPE]-YYYYMMDD-XXXXX`; application status set to "Submitted." |

### 3.1.5 Module: Credit Assessment & Scoring

**User Story:** *As a Loan Officer, I want an automated preliminary credit score so that I can prioritize and support my underwriting decision.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-CRD-01 | The system shall calculate a rule-based internal credit score using configurable weighted factors (income, DTI ratio, employment stability, existing bank relationship, requested LTV). | Score (0–1000 scale) computed and stored immediately after document verification is complete. |
| FR-CRD-02 | The system shall integrate with the Credit Information Bureau (CRIB) via a certified API/stub to retrieve the applicant's credit history and existing exposure. | CRIB response (or sandbox-equivalent) stored against the application; failure gracefully routes to manual bureau-check fallback. |
| FR-CRD-03 | The system shall compute the Debt-to-Income (DTI) ratio and flag applications exceeding the configurable threshold (default 40%) for mandatory manual review. | Applications with DTI > threshold cannot be auto-approved regardless of score. |
| FR-CRD-04 | For Home/Vehicle loans, the system shall compute the Loan-to-Value (LTV) ratio and enforce configurable maximum LTV per product. | Submission blocked if requested amount exceeds max LTV × declared collateral value. |
| FR-CRD-05 | The system shall present the Loan Officer with a consolidated risk/score dashboard combining internal score, CRIB data, DTI, LTV, and KYC risk tier. | All five data points visible on a single review screen before officer decision. |
| FR-CRD-06 | The system shall support Admin-configurable score thresholds for auto-approval, manual-review, and auto-decline bands. | Changing a threshold in Admin takes effect for new applications without a code deployment. |

### 3.1.6 Module: Underwriting & Approval Workflow

**User Story:** *As a Branch Manager, I want a maker-checker approval workflow so that lending decisions have appropriate oversight per delegated authority.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-UW-01 | The system shall implement a maker-checker model: the officer who processes/recommends an application cannot be the same user who gives final approval. | System blocks self-approval attempts and logs the attempt. |
| FR-UW-02 | The system shall route applications for approval based on configurable delegated authority limits (e.g., Loan Officer ≤ Rs. 500,000; Branch Manager ≤ Rs. 5,000,000; Credit Committee above). | Application routes automatically to the correct approver tier based on requested amount. |
| FR-UW-03 | The system shall allow an approver to Approve, Reject, Approve-with-Conditions, or Return for additional information, each requiring comments. | Every decision is logged with approver ID, timestamp, decision, and comments; customer notified. |
| FR-UW-04 | The system shall support conditional approvals (e.g., "subject to guarantor," "subject to valuation report") with tracked condition fulfillment before disbursement. | Disbursement stage is blocked until all conditions are marked "fulfilled" by an authorized officer. |
| FR-UW-05 | The system shall escalate applications pending decision beyond a configurable SLA (default 3 business days) to the next authority tier or trigger a reminder. | Escalation/reminder job runs daily and logs actions taken. |
| FR-UW-06 | The system shall maintain a full, immutable audit trail of every workflow state transition for each application. | Audit trail is viewable (read-only) by Compliance and Admin roles, exportable to CSV/PDF. |

### 3.1.7 Module: Document Management & e-Signature

**User Story:** *As a customer, I want to upload documents and digitally sign my loan agreement so that I can complete the process without printing paperwork.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-DOC-01 | The system shall allow customers to upload supporting documents (payslips, bank statements, business registration, property deeds) mapped to the dynamic checklist per FR-LOAN-04. | Each checklist item shows status: Not Uploaded / Uploaded / Verified / Rejected. |
| FR-DOC-02 | The system shall version-control re-uploaded documents, retaining prior versions for audit purposes. | Previous versions remain accessible to staff roles with timestamp and uploader identity. |
| FR-DOC-03 | The system shall generate the loan offer letter/agreement as a PDF populated with application data upon approval. | Generated PDF matches the approved terms exactly (amount, tenure, rate, fees). |
| FR-DOC-04 | The system shall support consent-based e-signature capture (e.g., OTP-authenticated click-to-sign) legally representing customer acceptance of the loan agreement. | Signature event records customer identity, OTP verification, timestamp, and IP address, embedded/attached to the signed document. |
| FR-DOC-05 | The system shall store all documents encrypted at rest and restrict access via RBAC and need-to-know, with all views logged. | Document access outside assigned application/role is denied and logged as an attempted violation. |

### 3.1.8 Module: Loan Disbursement & Account Management

**User Story:** *As a Loan Officer, I want approved and signed loans to disburse accurately into the customer's account so that funds reach the customer without manual re-entry errors.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-DIS-01 | The system shall verify all conditions (FR-UW-04) are fulfilled and the agreement is e-signed before enabling disbursement. | Disbursement action is disabled/greyed out until both checks pass. |
| FR-DIS-02 | The system shall trigger a disbursement instruction to the CBS via API, specifying account, amount, and value date. | CBS API call payload matches approved loan terms exactly; response (success/failure) captured. |
| FR-DIS-03 | The system shall generate a repayment schedule (amortization table) upon successful disbursement. | Schedule reflects correct principal/interest split per installment using `BigDecimal` precision. |
| FR-DIS-04 | The system shall update the application status to "Disbursed" and notify the customer with disbursement confirmation and repayment schedule. | Notification sent within 5 minutes of successful CBS confirmation. |
| FR-DIS-05 | The system shall handle CBS disbursement failures gracefully, retry per configurable policy, and alert Admin/Loan Officer on repeated failure. | After 3 failed retries, application flagged "Disbursement Failed – Manual Intervention Required." |

### 3.1.9 Module: Admin & Backend Dashboard

**User Story:** *As a System Administrator, I want to configure products, roles, and workflow rules so that the platform adapts to evolving bank policy without code changes.*

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-ADM-01 | The system shall allow Admin to create/edit/deactivate loan and account products, including interest rates, fees, min/max amounts, and tenure. | Deactivated products are hidden from new customer applications but preserved on historical records. |
| FR-ADM-02 | The system shall allow Admin to manage users and role assignments across all 5 user classes. | Role changes take effect on the user's next token refresh/login. |
| FR-ADM-03 | The system shall allow Admin to configure workflow parameters: approval thresholds, SLA durations, credit score bands, DTI/LTV limits. | Configuration changes are versioned and logged with the Admin's identity and timestamp. |
| FR-ADM-04 | The system shall provide Admin visibility into system health: integration status (CBS, CRIB, e-KYC, SMS/Email), failed jobs, and error queues. | Integration status dashboard refreshes at least every 60 seconds. |
| FR-ADM-05 | The system shall allow Admin to view and export the full audit log with filters (user, date range, action type, application ID). | Export supports CSV and PDF formats. |

### 3.1.10 Module: Notifications (Email/SMS)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-NOT-01 | The system shall send SMS and/or email notifications at defined milestones: application submitted, KYC additional info required, application approved/rejected, agreement ready for signature, disbursement completed. | Each milestone triggers within 2 minutes of the corresponding system event. |
| FR-NOT-02 | The system shall allow Admin to configure notification templates per event and channel. | Template changes reflect in the next triggered notification without deployment. |
| FR-NOT-03 | The system shall log delivery status (sent, delivered, failed) for each notification and support retry for failures. | Failed notifications are retried up to 3 times with exponential backoff. |

### 3.1.11 Module: Reporting & Analytics

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-RPT-01 | The system shall provide operational reports: applications by status, average processing time (TAT), approval/decline rates by product/branch. | Reports filterable by date range, branch, product, and officer. |
| FR-RPT-02 | The system shall provide compliance-support reports: KYC risk-tier distribution, PEP/sanctions hits, applications pending compliance review beyond SLA. | Report supports Compliance Officer preparation of internal CTR/STR-related reviews. |
| FR-RPT-03 | The system shall provide portfolio dashboards (Branch Manager/Admin view): total disbursed value, active pipeline value, NPL-relevant flags (future-phase hook). | Dashboard widgets refresh on demand and via scheduled cache refresh (≤15 min staleness). |
| FR-RPT-04 | The system shall support scheduled/automated export of key reports (e.g., daily new applications, weekly disbursement summary) to authorized recipients. | Scheduled exports run reliably per configured cron schedule and log execution success/failure. |

## 3.2 Non-Functional Requirements

### 3.2.1 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-01 | 95% of API requests shall respond within 800ms under normal load (excluding third-party integration latency). |
| NFR-PERF-02 | The system shall support a minimum of 2,000 concurrent active users without performance degradation beyond defined thresholds. |
| NFR-PERF-03 | The loan application wizard shall load each step within 2 seconds on a 4G mobile connection. |
| NFR-PERF-04 | Batch/report generation jobs shall complete within 5 minutes for datasets up to 1 million records. |

### 3.2.2 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | The system shall implement protections against the OWASP Top 10 (injection, broken auth, XSS, insecure deserialization, etc.), validated via periodic penetration testing. |
| NFR-SEC-02 | All data in transit shall be encrypted using TLS 1.2 or higher; all sensitive data at rest (PII, KYC documents, credentials) shall be encrypted using AES-256. |
| NFR-SEC-03 | Passwords shall be stored using a strong adaptive hashing algorithm (e.g., bcrypt/Argon2) — never in plaintext or reversible encryption. |
| NFR-SEC-04 | The system shall maintain immutable, tamper-evident audit logs for all sensitive actions (login, KYC decisions, approvals, disbursements, configuration changes), retained per regulatory requirement. |
| NFR-SEC-05 | The system shall enforce session expiry (JWT access token ≤15 minutes) and secure refresh-token rotation with revocation support. |
| NFR-SEC-06 | The system shall implement rate limiting and brute-force protection on all authentication and OTP endpoints. |
| NFR-SEC-07 | All third-party integrations (CBS, CRIB, e-KYC) shall use mutually authenticated, encrypted channels with least-privilege API credentials. |

### 3.2.3 Scalability & Reliability

| ID | Requirement |
|---|---|
| NFR-SCAL-01 | The system architecture shall support horizontal scaling of the Spring Boot service layer via containerization (Docker/Kubernetes-compatible). |
| NFR-SCAL-02 | The system shall achieve 99.5% uptime during banking business hours (excluding scheduled maintenance windows). |
| NFR-SCAL-03 | The system shall implement database connection pooling and support read-replica scaling for reporting workloads. |
| NFR-SCAL-04 | The system shall gracefully degrade (queue/retry) rather than fail outright when a downstream integration (CBS/CRIB/e-KYC) is temporarily unavailable. |

### 3.2.4 Usability & Accessibility

| ID | Requirement |
|---|---|
| NFR-USE-01 | The customer-facing UI shall conform to WCAG 2.1 Level AA accessibility guidelines. |
| NFR-USE-02 | The UI shall be mobile-first responsive, fully functional on screens from 360px to 2560px width. |
| NFR-USE-03 | The system shall support English and Sinhala (with Tamil as a future-phase enhancement) for customer-facing content. |
| NFR-USE-04 | Error messages shall be clear, actionable, and free of technical jargon for customer-facing screens. |

### 3.2.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-MAIN-01 | The backend codebase shall follow a layered architecture (Controller–Service–Repository) with clear separation of concerns to support independent module updates. |
| NFR-MAIN-02 | All REST APIs shall be documented via Swagger/OpenAPI and kept in sync with implementation through CI validation. |
| NFR-MAIN-03 | The system shall maintain a minimum of 70% automated unit/integration test coverage on core business logic (credit scoring, workflow, disbursement calculation). |
| NFR-MAIN-04 | Configuration values (thresholds, product parameters) shall be externalized (database/config-driven), not hardcoded. |

### 3.2.6 Compliance & Regulatory

| ID | Requirement |
|---|---|
| NFR-COMP-01 | The system shall implement Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) workflows per CBSL Banking Act Directions and FIU AML/CFT Guidelines. |
| NFR-COMP-02 | The system shall comply with the Personal Data Protection Act No. 9 of 2022, including lawful basis for processing, data subject consent records, and data minimization. |
| NFR-COMP-03 | The system shall retain KYC and transaction records for the minimum period mandated by CBSL/FIU (default configurable to 6 years) and support secure, logged disposal thereafter. |
| NFR-COMP-04 | The system shall support generation of data extracts required for Suspicious Transaction Report (STR) and Cash Transaction Report (CTR) preparation by Compliance Officers. |
| NFR-COMP-05 | The system shall maintain data residency within infrastructure locations approved for Sri Lankan banking operations. |

---

# 4. System Features / Use Cases

## UC-01: Digital Account Opening

| Field | Description |
|---|---|
| **Use Case ID** | UC-01 |
| **Name** | Open a Digital Savings Account |
| **Actor(s)** | Customer (primary), Loan/Onboarding Officer, Compliance Officer, CBS (system actor) |
| **Preconditions** | Customer has a valid NIC and access to a camera-enabled device; customer is a resident individual. |
| **Postconditions (Success)** | A new savings account is created in the CBS and the customer receives account details and login credentials for online banking (future-phase link). |
| **Postconditions (Failure)** | Application marked "Rejected" or "Incomplete – Awaiting Customer"; customer notified with reason. |
| **Main Flow** | 1. Customer registers/logs in. 2. Customer starts Account Opening wizard. 3. Customer enters personal details. 4. Customer completes e-KYC (NIC upload, OCR confirm, liveness selfie). 5. System performs sanctions/PEP screening. 6. Customer selects account product and reviews terms. 7. Customer provides consent and submits. 8. System generates reference number and routes to Onboarding Officer queue. 9. Officer reviews KYC/CDD data and approves. 10. System calls CBS API to create the account. 11. System notifies customer of successful account opening. |
| **Alternative Flows** | A1: OCR extraction fails → customer manually enters details for officer verification. <br> A2: Liveness match score low → routed to manual video/in-branch verification (out of MVP auto-flow, flagged for staff handling). <br> A3: Sanctions/PEP hit → routed to Compliance Officer for EDD before any approval. <br> A4: CBS API failure → system retries per policy and alerts Admin if unresolved. |
| **Exceptions** | Duplicate NIC already registered → system blocks duplicate application and surfaces existing-customer message. |

## UC-02: Apply for a Loan (Generic — specialized per product)

| Field | Description |
|---|---|
| **Use Case ID** | UC-02 |
| **Name** | Submit a Loan Application |
| **Actor(s)** | Customer (primary), Loan Officer, Credit Assessment Engine (system actor), CRIB (external system) |
| **Preconditions** | Customer is registered and has completed e-KYC (or completes it as part of this flow if first-time applicant). |
| **Postconditions (Success)** | Application reaches "Submitted" status and enters the Credit Assessment stage. |
| **Postconditions (Failure)** | Application remains in "Draft" or is withdrawn by customer. |
| **Main Flow** | 1. Customer selects loan type. 2. System renders the type-specific wizard. 3. Customer enters loan details, income, and product-specific data. 4. System displays indicative EMI. 5. Customer uploads required documents per dynamic checklist. 6. Customer reviews and submits. 7. System generates a loan reference number and status "Submitted." 8. System triggers Credit Assessment (UC-03) automatically. |
| **Alternative Flows** | A1: Customer saves as draft and resumes later (within 30 days). <br> A2: Requested amount exceeds product maximum → system blocks submission with guidance. |
| **Exceptions** | Mandatory document missing at submission → system blocks submission and highlights missing items. |

## UC-03: Credit Assessment & Underwriting Decision

| Field | Description |
|---|---|
| **Use Case ID** | UC-03 |
| **Name** | Assess Credit and Render Underwriting Decision |
| **Actor(s)** | Loan Officer, Branch Manager/Credit Committee (as applicable), Credit Scoring Engine, CRIB |
| **Preconditions** | Loan application status is "Submitted" and required documents are uploaded. |
| **Postconditions (Success)** | Application status becomes "Approved" (or "Approved with Conditions") and moves to Document/e-Signature stage. |
| **Postconditions (Failure)** | Application status becomes "Rejected" or "Returned for Information," with customer notified. |
| **Main Flow** | 1. System calculates internal credit score and DTI/LTV. 2. System retrieves CRIB report. 3. Loan Officer reviews consolidated risk dashboard. 4. Officer recommends Approve/Reject/Conditions. 5. Application routes to the appropriate approval tier per delegated authority (FR-UW-02). 6. Approver reviews and renders final decision with comments. 7. System updates status and notifies customer. |
| **Alternative Flows** | A1: Score falls in "auto-approve" band and no compliance flags exist → system may auto-approve per configured policy, subject to Branch Manager post-review sampling. <br> A2: DTI/LTV exceeds threshold → mandatory manual review regardless of score. |
| **Exceptions** | CRIB integration unavailable → application flagged "Pending Bureau Check" and held from final decision until resolved or manually overridden by authorized Compliance/Credit staff with justification. |

## UC-04: e-Signature and Disbursement

| Field | Description |
|---|---|
| **Use Case ID** | UC-04 |
| **Name** | Sign Loan Agreement and Disburse Funds |
| **Actor(s)** | Customer, Loan Officer, CBS (system actor) |
| **Preconditions** | Application status is "Approved" (or "Approved with Conditions" fully satisfied). |
| **Postconditions (Success)** | Funds disbursed to customer's account; status "Disbursed"; repayment schedule generated. |
| **Postconditions (Failure)** | Disbursement blocked pending unresolved conditions or CBS failure, flagged for manual intervention. |
| **Main Flow** | 1. System generates the loan offer/agreement PDF. 2. Customer reviews and initiates e-signature (OTP-authenticated). 3. System records signature event and finalizes the signed document. 4. Loan Officer verifies all conditions fulfilled. 5. Officer triggers disbursement. 6. System calls CBS API to post disbursement. 7. System generates the repayment schedule. 8. System notifies customer with confirmation and schedule. |
| **Alternative Flows** | A1: Customer declines to sign within validity window (e.g., 14 days) → offer expires, application status "Offer Expired." |
| **Exceptions** | CBS disbursement API failure → retried per policy; after max retries, escalated to Admin for manual CBS posting and reconciliation. |

## UC-05: Compliance Review of High-Risk Application

| Field | Description |
|---|---|
| **Use Case ID** | UC-05 |
| **Name** | Perform Enhanced Due Diligence on a Flagged Application |
| **Actor(s)** | Compliance/AML Officer |
| **Preconditions** | Application flagged High Risk (sanctions/PEP hit or high-risk profile per FR-KYC-05). |
| **Postconditions (Success)** | Compliance Officer clears the application to proceed (with or without conditions), decision logged. |
| **Postconditions (Failure)** | Compliance Officer rejects/escalates the application per internal AML policy; regulatory reporting workflow initiated if warranted (outside system, supported by FR-RPT-02 data extracts). |
| **Main Flow** | 1. Officer opens the flagged case from the Compliance queue. 2. Officer reviews KYC data, screening hit details, and source-of-funds declaration. 3. Officer may request additional documentation from the customer via the system. 4. Officer records a decision with mandatory justification. 5. System updates application status and audit trail accordingly. |
| **Alternative Flows** | A1: Officer requests additional info → application status "Pending Customer Response," customer notified. |
| **Exceptions** | Screening service unavailable → application held in "Pending Screening" state; cannot proceed to approval until resolved. |

---

# 5. Data Requirements

## 5.1 Entity Relationship Summary (Key Entities)

```
CUSTOMER (1) ───< (M) ACCOUNT
CUSTOMER (1) ───< (M) LOAN_APPLICATION
CUSTOMER (1) ───< (M) KYC_RECORD
LOAN_APPLICATION (1) ───< (M) LOAN_DOCUMENT
LOAN_APPLICATION (1) ───< (1) CREDIT_ASSESSMENT
LOAN_APPLICATION (1) ───< (M) WORKFLOW_APPROVAL
LOAN_APPLICATION (1) ───< (1) DISBURSEMENT
LOAN_APPLICATION (1) ───< (M) REPAYMENT_SCHEDULE_ITEM
USER (STAFF) (1) ───< (M) WORKFLOW_APPROVAL
USER (1) ───< (M) AUDIT_LOG
LOAN_APPLICATION (M) ───> (1) LOAN_PRODUCT
ACCOUNT (M) ───> (1) ACCOUNT_PRODUCT
LOAN_APPLICATION (1) ───< (M) NOTIFICATION
```

### Key Entities Overview

| Entity | Purpose |
|---|---|
| CUSTOMER | Master record of a registered applicant/customer |
| USER (STAFF) | Internal system users (Loan Officer, Compliance, Branch Manager, Admin) |
| KYC_RECORD | e-KYC verification results, risk tier, screening outcomes |
| ACCOUNT | Digitally opened bank account application/record |
| ACCOUNT_PRODUCT | Configurable savings account product catalog |
| LOAN_APPLICATION | Core loan application record across all loan types |
| LOAN_PRODUCT | Configurable loan product catalog (rates, limits, tenure) |
| LOAN_DOCUMENT | Uploaded/versioned supporting documents |
| CREDIT_ASSESSMENT | Score, DTI, LTV, CRIB reference data per application |
| WORKFLOW_APPROVAL | Maker-checker decision history per application |
| DISBURSEMENT | Disbursement transaction record linked to CBS posting |
| REPAYMENT_SCHEDULE_ITEM | Amortization schedule line items |
| NOTIFICATION | Notification dispatch log (channel, status) |
| AUDIT_LOG | Immutable log of sensitive system actions |

## 5.2 Data Dictionary (Key Fields)

### CUSTOMER

| Field | Type | Constraints |
|---|---|---|
| customer_id | BIGINT | PK, auto-increment |
| nic_number | VARCHAR(12) | Unique, NOT NULL, validated checksum |
| full_name | VARCHAR(150) | NOT NULL |
| date_of_birth | DATE | NOT NULL |
| mobile_number | VARCHAR(15) | Unique, NOT NULL, OTP-verified |
| email | VARCHAR(150) | Unique, NOT NULL, OTP-verified |
| address | VARCHAR(255) | NOT NULL |
| occupation | VARCHAR(100) | NOT NULL |
| risk_tier | ENUM('LOW','MEDIUM','HIGH') | NOT NULL, default LOW pending KYC |
| status | ENUM('PENDING','ACTIVE','SUSPENDED') | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

### LOAN_APPLICATION

| Field | Type | Constraints |
|---|---|---|
| application_id | BIGINT | PK, auto-increment |
| application_ref | VARCHAR(30) | Unique, NOT NULL |
| customer_id | BIGINT | FK → CUSTOMER, NOT NULL |
| loan_product_id | BIGINT | FK → LOAN_PRODUCT, NOT NULL |
| loan_type | ENUM('PERSONAL','HOME','VEHICLE','SME') | NOT NULL |
| requested_amount | DECIMAL(15,2) | NOT NULL, > 0 |
| tenure_months | INT | NOT NULL, > 0 |
| status | ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','APPROVED_CONDITIONAL','REJECTED','SIGNED','DISBURSED','OFFER_EXPIRED') | NOT NULL |
| submitted_at | TIMESTAMP | Nullable (null while draft) |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### CREDIT_ASSESSMENT

| Field | Type | Constraints |
|---|---|---|
| assessment_id | BIGINT | PK, auto-increment |
| application_id | BIGINT | FK → LOAN_APPLICATION, unique |
| internal_score | INT | 0–1000 |
| crib_reference | VARCHAR(50) | Nullable pending integration |
| dti_ratio | DECIMAL(5,2) | 0–100+ |
| ltv_ratio | DECIMAL(5,2) | Nullable (non-collateral products) |
| decision_band | ENUM('AUTO_APPROVE','MANUAL_REVIEW','AUTO_DECLINE') | NOT NULL |
| assessed_at | TIMESTAMP | NOT NULL |

### KYC_RECORD

| Field | Type | Constraints |
|---|---|---|
| kyc_id | BIGINT | PK, auto-increment |
| customer_id | BIGINT | FK → CUSTOMER, NOT NULL |
| nic_document_ref | VARCHAR(255) | Encrypted storage pointer, NOT NULL |
| liveness_match_score | DECIMAL(5,2) | 0–100 |
| screening_result | ENUM('CLEAR','HIT','PENDING') | NOT NULL |
| verified_by | BIGINT | FK → USER (STAFF), nullable until reviewed |
| verified_at | TIMESTAMP | Nullable |

### WORKFLOW_APPROVAL

| Field | Type | Constraints |
|---|---|---|
| approval_id | BIGINT | PK, auto-increment |
| application_id | BIGINT | FK → LOAN_APPLICATION, NOT NULL |
| approver_user_id | BIGINT | FK → USER (STAFF), NOT NULL |
| decision | ENUM('APPROVE','REJECT','APPROVE_CONDITIONAL','RETURN_FOR_INFO') | NOT NULL |
| comments | TEXT | NOT NULL |
| decided_at | TIMESTAMP | NOT NULL |

### AUDIT_LOG

| Field | Type | Constraints |
|---|---|---|
| audit_id | BIGINT | PK, auto-increment |
| user_id | BIGINT | FK → USER (STAFF) or CUSTOMER, NOT NULL |
| action_type | VARCHAR(100) | NOT NULL (e.g., LOGIN, KYC_APPROVE, DISBURSE) |
| entity_reference | VARCHAR(100) | Nullable (e.g., application_ref) |
| ip_address | VARCHAR(45) | NOT NULL |
| timestamp | TIMESTAMP | NOT NULL |
| details | TEXT | Nullable, structured JSON permitted |

---

# 6. External Interfaces

## 6.1 User Interfaces (React Frontend)

| Interface | Description |
|---|---|
| Customer Portal | Registration, login, account opening wizard, loan application wizard, document upload, e-signature, application status tracker, notifications inbox |
| Loan Officer Console | Application queue, applicant 360° view, document verification, credit dashboard, recommendation submission |
| Compliance Officer Console | KYC/AML case queue, screening hit review, EDD case management, audit log viewer |
| Branch Manager Dashboard | Approval queue (within delegated authority), branch pipeline analytics, escalations |
| Admin Console | Product configuration, user/role management, workflow parameter configuration, system health monitor, audit export |

All interfaces are built as a single React.js SPA with route-based access control, shared component library, and mobile-first responsive layout (per NFR-USE-02).

## 6.2 REST API Interfaces (Representative Endpoints)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Customer self-registration | Public (OTP-gated) |
| POST | `/api/v1/auth/login` | User login, issues JWT | Public |
| POST | `/api/v1/auth/refresh` | Refresh access token | Refresh token |
| POST | `/api/v1/kyc/upload-document` | Upload NIC/KYC documents | Customer (JWT) |
| POST | `/api/v1/kyc/liveness-check` | Submit selfie for liveness match | Customer (JWT) |
| POST | `/api/v1/accounts/apply` | Submit account opening application | Customer (JWT) |
| POST | `/api/v1/loans/apply` | Submit loan application | Customer (JWT) |
| GET | `/api/v1/loans/{applicationId}` | Retrieve application details | Customer/Staff (JWT, RBAC) |
| POST | `/api/v1/loans/{applicationId}/assess` | Trigger/retrieve credit assessment | Loan Officer (JWT, RBAC) |
| POST | `/api/v1/loans/{applicationId}/decision` | Record underwriting decision | Approver roles (JWT, RBAC) |
| POST | `/api/v1/loans/{applicationId}/sign` | Record e-signature event | Customer (JWT, OTP) |
| POST | `/api/v1/loans/{applicationId}/disburse` | Trigger disbursement | Loan Officer/Admin (JWT, RBAC) |
| GET | `/api/v1/reports/operational` | Retrieve operational report data | Staff (JWT, RBAC) |
| GET | `/api/v1/admin/products` | Manage products | Admin (JWT, RBAC) |

All endpoints are documented via **Swagger/OpenAPI 3.0** at `/swagger-ui.html`, versioned under `/api/v1/`, and require a valid JWT bearer token except where explicitly public/OTP-gated.

## 6.3 Integration Interfaces

| System | Direction | Purpose | Protocol |
|---|---|---|---|
| Core Banking System (CBS) | Outbound/Inbound | Account creation, disbursement posting, balance/account status confirmation | REST/SOAP via secure API gateway (per bank's CBS capability) |
| Credit Information Bureau (CRIB) | Outbound/Inbound | Credit history enquiry for underwriting | REST API (certified sandbox in MVP) |
| e-KYC / OCR / Liveness Vendor | Outbound/Inbound | NIC OCR extraction, selfie liveness match | REST API, abstraction layer for vendor substitution |
| Sanctions/PEP Screening Provider | Outbound/Inbound | Watch-list screening for AML compliance | REST API |
| SMS Gateway | Outbound | OTP delivery, milestone notifications | REST API / SMPP (per gateway provider) |
| Email Gateway (SMTP/Transactional) | Outbound | OTP delivery, milestone notifications, document delivery | SMTP / REST API |

---

# 7. Other Requirements

## 7.1 Future Enhancements

- Native mobile applications (iOS/Android) with biometric login.
- Full production integration with DRP for NIC validation and CRIB for live bureau data.
- Video-KYC with live compliance agent for high-risk onboarding tiers.
- AI/ML-based credit scoring model (supplementing the rule-based engine) with model governance and explainability controls.
- Joint account and full corporate/company account opening.
- Islamic banking (Shariah-compliant) loan product variants.
- Customer self-service loan top-up and restructuring requests.
- Real-time fraud analytics and behavioral biometrics.
- Multi-language expansion (Tamil) across all customer-facing flows.

## 7.2 Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Regulatory change to digital onboarding rules mid-project | High | Medium | Design risk-tiering and workflow as fully configurable; maintain close liaison with CBSL/FIU updates |
| e-KYC/liveness vendor accuracy issues (false accept/reject) | High | Medium | Configurable match thresholds; manual review fallback path; vendor SLA monitoring |
| CBS integration delays/instability | High | Medium | Certified sandbox/stub for MVP development; robust retry and reconciliation design |
| CRIB API unavailability in production | Medium | Medium | Manual bureau-check fallback workflow; cached last-known data where compliant |
| Data breach of customer PII/KYC documents | Critical | Low | Encryption at rest/in transit, RBAC, regular penetration testing, ISO 27001-aligned controls |
| Maker-checker bypass / insider fraud | High | Low | Enforced role separation at code level, immutable audit logging, periodic access reviews |
| Poor customer digital literacy leading to abandoned applications | Medium | Medium | Simplified UX, save-as-draft, multi-language support, assisted-mode via branch staff |
| Scalability bottleneck during marketing-driven demand spikes | Medium | Medium | Horizontal scaling architecture, load testing prior to go-live, autoscaling policies |
| AML screening false negatives due to name-matching limitations | Critical | Low | Fuzzy-matching thresholds tuned conservatively; periodic screening provider audit; manual secondary review for borderline cases |

---

**End of Document**

*This SRS is a living document and shall be updated iteratively as requirements are refined through stakeholder review, prototyping, and regulatory consultation (CBSL/FIU) prior to development sign-off.*
