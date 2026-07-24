var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var db = {
  products: {
    savings: [
      { id: 1, name: "Regular Savings", interestRate: "3.5%", minBalance: 1e3, active: true },
      { id: 2, name: "Youth Savings (18-25)", interestRate: "4.5%", minBalance: 500, active: true },
      { id: 3, name: "Senior Citizens Savings", interestRate: "5.5%", minBalance: 1e3, active: true }
    ],
    loans: [
      { id: 101, type: "PERSONAL", name: "Speedy Personal Loan", minAmount: 5e4, maxAmount: 1e6, interestRate: 14.5, defaultTenure: 36, active: true },
      { id: 102, type: "HOME", name: "Dream Home Loan", minAmount: 1e6, maxAmount: 25e6, interestRate: 11.2, defaultTenure: 180, active: true },
      { id: 103, type: "VEHICLE", name: "WheelSphere Vehicle Loan", minAmount: 5e5, maxAmount: 1e7, interestRate: 12.8, defaultTenure: 60, active: true },
      { id: 104, type: "SME", name: "SME Growth Engine Loan", minAmount: 1e6, maxAmount: 5e7, interestRate: 13.5, defaultTenure: 48, active: true }
    ]
  },
  users: [
    { username: "officer", password: "password", fullName: "Aruni Perera", role: "LOAN_OFFICER", branch: "Colombo Fort" },
    { username: "compliance", password: "password", fullName: "Sajith Silva", role: "COMPLIANCE_OFFICER", branch: "Head Office" },
    { username: "manager", password: "password", fullName: "Niranjan Jayawardena", role: "BRANCH_MANAGER", branch: "Colombo Fort" },
    { username: "admin", password: "password", fullName: "Admin Sphere", role: "ADMIN", branch: "Head Office" }
  ],
  customers: [
    {
      customer_id: 1,
      nic_number: "199234509123",
      full_name: "Kamal Bandara",
      date_of_birth: "1992-05-14",
      mobile_number: "+94771234567",
      email: "kamal@gmail.com",
      address: "No. 45, Flower Road, Colombo 07",
      occupation: "Software Engineer",
      risk_tier: "LOW",
      status: "ACTIVE",
      created_at: "2026-06-10T10:00:00Z",
      source_of_funds: "Salary",
      monthly_turnover: "250000",
      has_savings_account: true
    },
    {
      customer_id: 2,
      nic_number: "198851234567",
      full_name: "Fathima Rizan",
      date_of_birth: "1988-11-20",
      mobile_number: "+94719876543",
      email: "fathima@gmail.com",
      address: "No. 12/A, Kandy Road, Kadawatha",
      occupation: "Business Owner",
      risk_tier: "MEDIUM",
      status: "ACTIVE",
      created_at: "2026-07-01T09:30:00Z",
      source_of_funds: "Business Revenue",
      monthly_turnover: "800000",
      has_savings_account: false
    }
  ],
  accounts: [
    { account_id: 1001, customer_id: 1, product_name: "Regular Savings", account_number: "8120045610", status: "ACTIVE", created_at: "2026-06-10T10:15:00Z" }
  ],
  applications: [
    {
      application_id: 2001,
      application_ref: "NBLS-LN-PERSONAL-20260710-001",
      customer_id: 1,
      loan_product_id: 101,
      loan_type: "PERSONAL",
      requested_amount: 5e5,
      tenure_months: 24,
      status: "DISBURSED",
      submitted_at: "2026-07-10T11:00:00Z",
      created_at: "2026-07-10T10:45:00Z",
      updated_at: "2026-07-10T14:30:00Z",
      documents: [
        { name: "NIC Copy", status: "VERIFIED", url: "nic_scan.pdf", updated_at: "2026-07-10T11:15:00Z" },
        { name: "Salary Slips", status: "VERIFIED", url: "payslips.pdf", updated_at: "2026-07-10T11:15:00Z" },
        { name: "Bank Statement", status: "VERIFIED", url: "statement.pdf", updated_at: "2026-07-10T11:15:00Z" }
      ],
      assessment: {
        internal_score: 780,
        crib_reference: "CRIB-LN-99214A",
        dti_ratio: 28.5,
        ltv_ratio: null,
        decision_band: "AUTO_APPROVE",
        assessed_at: "2026-07-10T11:30:00Z"
      },
      approvals: [
        { approver: "Aruni Perera", role: "LOAN_OFFICER", decision: "APPROVE", comments: "Highly stable income, excellent DTI.", decided_at: "2026-07-10T12:00:00Z" },
        { approver: "Niranjan Jayawardena", role: "BRANCH_MANAGER", decision: "APPROVE", comments: "Disbursement authorized.", decided_at: "2026-07-10T14:00:00Z" }
      ],
      repayment_schedule: [
        { installment_no: 1, dueDate: "2026-08-10", emi: 24115, principal: 18115, interest: 6e3, balance: 481885 },
        { installment_no: 2, dueDate: "2026-09-10", emi: 24115, principal: 18332, interest: 5783, balance: 463553 }
      ],
      conditions: [],
      disbursement_details: { account_number: "8120045610", disbursed_at: "2026-07-10T14:30:00Z", reference: "CBS-DISB-99824" }
    },
    {
      application_id: 2002,
      application_ref: "NBLS-LN-SME-20260718-002",
      customer_id: 2,
      loan_product_id: 104,
      loan_type: "SME",
      requested_amount: 15e6,
      tenure_months: 60,
      status: "UNDER_REVIEW",
      submitted_at: "2026-07-18T14:20:00Z",
      created_at: "2026-07-18T13:00:00Z",
      updated_at: "2026-07-18T15:10:00Z",
      documents: [
        { name: "Business Registration", status: "VERIFIED", url: "biz_reg.pdf", updated_at: "2026-07-18T14:30:00Z" },
        { name: "Audited Financials", status: "PENDING", url: "financials.pdf", updated_at: "2026-07-18T14:30:00Z" },
        { name: "Collateral Valuation", status: "REJECTED", url: "valuation_v1.pdf", updated_at: "2026-07-18T15:00:00Z", comment: "Please upload certified engineering valuation report." }
      ],
      assessment: {
        internal_score: 620,
        crib_reference: "CRIB-LN-88122B",
        dti_ratio: 45.2,
        ltv_ratio: 65,
        decision_band: "MANUAL_REVIEW",
        assessed_at: "2026-07-18T14:45:00Z"
      },
      approvals: [],
      repayment_schedule: [],
      conditions: [
        { id: 1, text: "Subject to verified collateral valuation above 22,000,000 LKR", status: "PENDING" },
        { id: 2, text: "Subject to Personal Guarantor Statement", status: "PENDING" }
      ],
      disbursement_details: null
    }
  ],
  audit_logs: [
    { id: 1, userId: "admin", action_type: "SYSTEM_START", entity_reference: "NovaBank Engine", ip_address: "127.0.0.1", timestamp: "2026-07-20T05:30:00Z", details: "System initialized successfully." },
    { id: 2, userId: "officer", action_type: "LOGIN", entity_reference: "User: officer", ip_address: "192.168.1.10", timestamp: "2026-07-20T05:31:45Z", details: "Staff login successful." }
  ]
};
function logAudit(userId, actionType, entityRef, ip, details) {
  const newLog = {
    id: db.audit_logs.length + 1,
    userId,
    action_type: actionType,
    entity_reference: entityRef,
    ip_address: ip,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    details
  };
  db.audit_logs.unshift(newLog);
}
app.post("/api/v1/auth/login", (req, res) => {
  const { username, password, role } = req.body;
  const staff = db.users.find((u) => u.username === username && u.password === password);
  if (staff) {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.staff_${staff.username}_${staff.role}`;
    logAudit(staff.username, "LOGIN", `Staff Login: ${staff.fullName}`, req.ip || "127.0.0.1", "Successful authentication via credentials");
    return res.json({
      success: true,
      token,
      user: {
        username: staff.username,
        fullName: staff.fullName,
        role: staff.role,
        branch: staff.branch
      }
    });
  }
  const customer = db.customers.find((c) => c.mobile_number === username || c.nic_number === username || c.email === username);
  if (customer && password === "password") {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cust_${customer.customer_id}_CUSTOMER`;
    logAudit(customer.nic_number, "LOGIN", `Customer Login: ${customer.full_name}`, req.ip || "127.0.0.1", "Successful customer login");
    return res.json({
      success: true,
      token,
      user: {
        username: customer.nic_number,
        fullName: customer.full_name,
        role: "CUSTOMER",
        branch: "Digital Branch",
        customer_id: customer.customer_id,
        customerDetails: customer
      }
    });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials. For staff: use 'officer', 'compliance', 'manager', or 'admin' with password 'password'. For customers, use a registered mobile/NIC with 'password'." });
});
app.post("/api/v1/auth/register", (req, res) => {
  const { nic_number, full_name, date_of_birth, mobile_number, email, address, occupation, source_of_funds, monthly_turnover } = req.body;
  if (!nic_number || !full_name || !mobile_number || !email) {
    return res.status(400).json({ success: false, message: "Mandatory registration fields are missing." });
  }
  if (db.customers.some((c) => c.nic_number === nic_number)) {
    return res.status(400).json({ success: false, message: "NIC already registered in NovaBank LoanSphere." });
  }
  const newCustId = db.customers.length + 1;
  const newCustomer = {
    customer_id: newCustId,
    nic_number,
    full_name,
    date_of_birth: date_of_birth || "1990-01-01",
    mobile_number,
    email,
    address: address || "Not provided",
    occupation: occupation || "Other",
    risk_tier: "LOW",
    status: "ACTIVE",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    source_of_funds: source_of_funds || "Savings",
    monthly_turnover: monthly_turnover || "0",
    has_savings_account: false
  };
  db.customers.push(newCustomer);
  logAudit(nic_number, "REGISTRATION", `Register customer: ${full_name}`, req.ip || "127.0.0.1", "New digital registration completed");
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cust_${newCustId}_CUSTOMER`;
  res.json({
    success: true,
    token,
    user: {
      username: nic_number,
      fullName: full_name,
      role: "CUSTOMER",
      branch: "Digital Branch",
      customer_id: newCustId,
      customerDetails: newCustomer
    }
  });
});
app.get("/api/v1/products", (req, res) => {
  res.json(db.products);
});
app.post("/api/v1/admin/products", (req, res) => {
  const { type, id, name, interestRate, minAmount, maxAmount, defaultTenure } = req.body;
  if (type === "savings") {
    const p = db.products.savings.find((item) => item.id === id);
    if (p) {
      p.name = name;
      p.interestRate = interestRate;
      logAudit("admin", "PRODUCT_CONFIG", `Savings Product Update: ${name}`, req.ip || "127.0.0.1", `Updated interest rate to ${interestRate}`);
      return res.json({ success: true, message: "Product updated successfully." });
    }
  } else {
    const p = db.products.loans.find((item) => item.id === id);
    if (p) {
      p.name = name;
      p.interestRate = parseFloat(interestRate);
      p.minAmount = parseFloat(minAmount);
      p.maxAmount = parseFloat(maxAmount);
      p.defaultTenure = parseInt(defaultTenure);
      logAudit("admin", "PRODUCT_CONFIG", `Loan Product Update: ${name}`, req.ip || "127.0.0.1", `Updated rates/limits`);
      return res.json({ success: true, message: "Product updated successfully." });
    }
  }
  res.status(404).json({ success: false, message: "Product not found." });
});
app.post("/api/v1/accounts/apply", (req, res) => {
  const { customer_id, product_name, ocrDetails, livenessScore, screeningStatus, riskTier } = req.body;
  const customer = db.customers.find((c) => c.customer_id === parseInt(customer_id));
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }
  customer.risk_tier = riskTier || "LOW";
  const accountNo = `81200${Math.floor(1e4 + Math.random() * 9e4)}`;
  const newAccount = {
    account_id: db.accounts.length + 1001,
    customer_id: customer.customer_id,
    product_name,
    account_number: accountNo,
    status: "ACTIVE",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.accounts.push(newAccount);
  customer.has_savings_account = true;
  logAudit(customer.nic_number, "ACCOUNT_OPEN", `Account Opened: ${accountNo}`, req.ip || "127.0.0.1", `DAO product: ${product_name}. Liveness score: ${livenessScore}%, Screening: ${screeningStatus}, Assigned Risk: ${customer.risk_tier}`);
  res.json({
    success: true,
    account: newAccount,
    message: "Savings account successfully opened via automated e-KYC validation!"
  });
});
app.post("/api/v1/loans/apply", (req, res) => {
  const { customer_id, loan_product_id, loan_type, requested_amount, tenure_months, documents } = req.body;
  const customer = db.customers.find((c) => c.customer_id === parseInt(customer_id));
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }
  const application_id = db.applications.length + 2001;
  const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  const refNo = `NBLS-LN-${loan_type}-${dateStr}-00${db.applications.length + 1}`;
  const income = parseFloat(customer.monthly_turnover) || 15e4;
  const reqAmt = parseFloat(requested_amount);
  const emiEst = reqAmt * 1.12 / tenure_months;
  const dti = (emiEst / income * 100).toFixed(1);
  const internalScore = Math.floor(550 + Math.random() * 350);
  let decisionBand = "MANUAL_REVIEW";
  if (internalScore > 750 && parseFloat(dti) < 35) {
    decisionBand = "AUTO_APPROVE";
  } else if (internalScore < 600 || parseFloat(dti) > 55) {
    decisionBand = "AUTO_DECLINE";
  }
  const collateralMap = { HOME: 70, VEHICLE: 80, PERSONAL: null, SME: 60 };
  const ltv = collateralMap[loan_type] ? (50 + Math.random() * 25).toFixed(1) : null;
  const newApp = {
    application_id,
    application_ref: refNo,
    customer_id: customer.customer_id,
    loan_product_id: parseInt(loan_product_id),
    loan_type,
    requested_amount: reqAmt,
    tenure_months: parseInt(tenure_months),
    status: "SUBMITTED",
    submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    documents: (documents || []).map((d) => ({
      name: d.name,
      status: "PENDING",
      url: d.url || "document.pdf",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    })),
    assessment: {
      internal_score: internalScore,
      crib_reference: `CRIB-LN-${Math.floor(1e4 + Math.random() * 9e4)}B`,
      dti_ratio: parseFloat(dti),
      ltv_ratio: ltv ? parseFloat(ltv) : null,
      decision_band: decisionBand,
      assessed_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    approvals: [],
    repayment_schedule: [],
    conditions: loan_type === "HOME" || loan_type === "SME" ? [
      { id: 1, text: "Subject to certified site asset valuation check", status: "PENDING" },
      { id: 2, text: "Subject to verified legal deed clearance certificate", status: "PENDING" }
    ] : [],
    disbursement_details: null
  };
  db.applications.push(newApp);
  logAudit(customer.nic_number, "LOAN_SUBMIT", `Loan Sub: ${refNo}`, req.ip || "127.0.0.1", `Submitted ${loan_type} loan for LKR ${reqAmt}. Score: ${internalScore}, DTI: ${dti}%`);
  res.json({
    success: true,
    application: newApp,
    message: "Loan application successfully submitted for credit assessment."
  });
});
app.get("/api/v1/loans", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && token.startsWith("cust_")) {
    const custId = parseInt(token.split("_")[1]);
    const custApps = db.applications.filter((app2) => app2.customer_id === custId);
    return res.json(custApps);
  }
  res.json(db.applications);
});
app.get("/api/v1/accounts", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && token.startsWith("cust_")) {
    const custId = parseInt(token.split("_")[1]);
    const custAccounts = db.accounts.filter((acc) => acc.customer_id === custId);
    return res.json(custAccounts);
  }
  res.json(db.accounts);
});
app.post("/api/v1/loans/verify-document", (req, res) => {
  const { application_id, document_name, status, comment, staff_name } = req.body;
  const appItem = db.applications.find((a) => a.application_id === parseInt(application_id));
  if (!appItem) return res.status(404).json({ success: false, message: "Application not found" });
  const doc = appItem.documents.find((d) => d.name === document_name);
  if (doc) {
    doc.status = status;
    if (comment) doc.comment = comment;
    doc.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    appItem.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    logAudit(staff_name || "officer", "DOC_VERIFY", `Doc Verified: ${document_name}`, req.ip || "127.0.0.1", `Document status set to ${status} for ${appItem.application_ref}`);
    return res.json({ success: true, application: appItem });
  }
  res.status(404).json({ success: false, message: "Document not found" });
});
app.post("/api/v1/loans/decision", (req, res) => {
  const { application_id, decision, comments, staff_name, role } = req.body;
  const appItem = db.applications.find((a) => a.application_id === parseInt(application_id));
  if (!appItem) return res.status(404).json({ success: false, message: "Application not found" });
  const approvalObj = {
    approver: staff_name,
    role,
    decision,
    comments,
    decided_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  appItem.approvals.push(approvalObj);
  appItem.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  if (decision === "APPROVE") {
    if (role === "LOAN_OFFICER") {
      appItem.status = "UNDER_REVIEW";
    } else if (role === "BRANCH_MANAGER") {
      appItem.status = appItem.conditions.length > 0 ? "APPROVED_CONDITIONAL" : "APPROVED";
    }
  } else if (decision === "REJECT") {
    appItem.status = "REJECTED";
  } else if (decision === "RETURN_FOR_INFO") {
    appItem.status = "DRAFT";
  }
  logAudit(staff_name, "WORKFLOW_DECISION", `Decision: ${decision}`, req.ip || "127.0.0.1", `Staff ${staff_name} (${role}) recorded decision for ${appItem.application_ref}`);
  res.json({ success: true, application: appItem });
});
app.post("/api/v1/loans/satisfy-condition", (req, res) => {
  const { application_id, condition_id, staff_name } = req.body;
  const appItem = db.applications.find((a) => a.application_id === parseInt(application_id));
  if (!appItem) return res.status(404).json({ success: false, message: "Application not found" });
  const cond = appItem.conditions.find((c) => c.id === parseInt(condition_id));
  if (cond) {
    cond.status = "VERIFIED";
    const allPassed = appItem.conditions.every((c) => c.status === "VERIFIED");
    if (allPassed && appItem.status === "APPROVED_CONDITIONAL") {
      appItem.status = "APPROVED";
    }
    logAudit(staff_name || "officer", "CONDITION_SATISFY", `Condition Met: ID ${condition_id}`, req.ip || "127.0.0.1", `Cleared condition on ${appItem.application_ref}`);
    return res.json({ success: true, application: appItem });
  }
  res.status(404).json({ success: false, message: "Condition not found" });
});
app.post("/api/v1/loans/sign", (req, res) => {
  const { application_id, signature_method, otp_code } = req.body;
  const appItem = db.applications.find((a) => a.application_id === parseInt(application_id));
  if (!appItem) return res.status(404).json({ success: false, message: "Application not found" });
  if (otp_code !== "123456" && otp_code !== "1234") {
    return res.status(400).json({ success: false, message: "Invalid verification OTP code. Use 123456 to sign." });
  }
  appItem.status = "SIGNED";
  appItem.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  const rate = 12;
  const monthlyRate = rate / 100 / 12;
  const n = appItem.tenure_months;
  const principal = appItem.requested_amount;
  const emi = Math.round(principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1));
  let balance = principal;
  const schedule = [];
  for (let i = 1; i <= Math.min(n, 12); i++) {
    const interest = Math.round(balance * monthlyRate);
    const princPaid = emi - interest;
    balance -= princPaid;
    const dueDate = /* @__PURE__ */ new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    schedule.push({
      installment_no: i,
      dueDate: dueDate.toISOString().slice(0, 10),
      emi,
      principal: princPaid,
      interest,
      balance: balance < 0 ? 0 : Math.round(balance)
    });
  }
  appItem.repayment_schedule = schedule;
  logAudit(`cust_${appItem.customer_id}`, "LOAN_SIGN", `Signed Offer: ${appItem.application_ref}`, req.ip || "127.0.0.1", `Customer e-signed via ${signature_method}. OTP validated.`);
  res.json({ success: true, application: appItem });
});
app.post("/api/v1/loans/disburse", (req, res) => {
  const { application_id, staff_name, target_account_number } = req.body;
  const appItem = db.applications.find((a) => a.application_id === parseInt(application_id));
  if (!appItem) return res.status(404).json({ success: false, message: "Application not found" });
  if (appItem.status !== "SIGNED") {
    return res.status(400).json({ success: false, message: "Application must be e-signed by the customer before disbursement." });
  }
  const ref = `CBS-DISB-${Math.floor(1e5 + Math.random() * 9e5)}`;
  appItem.status = "DISBURSED";
  appItem.disbursement_details = {
    account_number: target_account_number || "8120045610",
    disbursed_at: (/* @__PURE__ */ new Date()).toISOString(),
    reference: ref
  };
  appItem.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  logAudit(staff_name, "DISBURSEMENT_RELEASE", `Disbursed: LKR ${appItem.requested_amount}`, req.ip || "127.0.0.1", `Released funds to account ${target_account_number || "8120045610"} for ${appItem.application_ref}. Ref: ${ref}`);
  res.json({ success: true, application: appItem });
});
app.post("/api/v1/loans/audit-export", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { export_type, ref_id, principal, loan_type, customer_name } = req.body;
  let userId = "guest";
  let fullName = customer_name || "Unregistered Guest User";
  if (token && token !== "null" && token !== "undefined") {
    if (token.startsWith("cust_")) {
      const custId = parseInt(token.split("_")[1]);
      const customer = db.customers.find((c) => c.customer_id === custId);
      if (customer) {
        userId = customer.nic_number;
        fullName = customer.full_name;
      }
    } else if (token.startsWith("staff_")) {
      const username = token.split("_")[1];
      const staff = db.users.find((u) => u.username === username);
      if (staff) {
        userId = staff.username;
        fullName = staff.fullName;
      }
    }
  }
  const amtStr = principal ? ` (LKR ${Math.round(principal).toLocaleString()})` : "";
  const details = `Generated and exported ${export_type === "quote" ? "Pre-qualification Quote PDF" : "Official Repayment Statement PDF"} for ${loan_type || "General"} Loan${amtStr}. Ref: ${ref_id || "N/A"}`;
  logAudit(userId, "EXPORT_PDF", `PDF Document Generation: ${fullName}`, req.ip || "127.0.0.1", details);
  res.json({ success: true, message: "PDF export event successfully registered in CBS Audit Trail." });
});
app.post("/api/v1/loans/calculate-schedule", (req, res) => {
  const { principal, annualRate, tenureMonths } = req.body;
  const p = parseFloat(principal);
  const r = parseFloat(annualRate) / 100 / 12;
  const n = parseInt(tenureMonths);
  if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
    return res.status(400).json({ success: false, message: "Invalid parameters supplied for CBS scheduler." });
  }
  const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const monthlyPayment = isNaN(emi) || !isFinite(emi) ? 0 : emi;
  let remainingBalance = p;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  const schedule = [];
  for (let month = 1; month <= n; month++) {
    const interestPayment = remainingBalance * r;
    const principalPayment = Math.min(remainingBalance, monthlyPayment - interestPayment);
    cumulativeInterest += interestPayment;
    cumulativePrincipal += principalPayment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
    const yearNumber = Math.ceil(month / 12);
    schedule.push({
      month,
      year: yearNumber,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      cumulativeInterest,
      cumulativePrincipal,
      balance: remainingBalance
    });
  }
  const totalPayment = cumulativeInterest + p;
  res.json({
    success: true,
    schedule,
    metrics: {
      totalInterest: cumulativeInterest,
      totalPayment,
      monthlyEmi: monthlyPayment
    }
  });
});
app.get("/api/v1/admin/audits", (req, res) => {
  res.json(db.audit_logs);
});
app.get("/api/v1/admin/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    uptimeSeconds: Math.floor(process.uptime()),
    integrations: {
      coreBanking: "CONNECTED (Stub API v2.1)",
      cribBureau: "CONNECTED (Mock Sandbox)",
      ekycOcr: "CONNECTED (OCR Service Online)",
      smsGateway: "ACTIVE (HTTP Trans-Sms)",
      emailProvider: "ACTIVE (SMTP TLS)"
    },
    databasePool: {
      activeConnections: 3,
      idleConnections: 12,
      driver: "MySQL Connector/J v8.0.33",
      dialect: "MySQL 8.x Dialect"
    }
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NovaBank LoanSphere full-stack server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
