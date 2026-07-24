// Centralized mock data for NovaBank LoanSphere
// Realistic Sri Lankan banking context (LKR currency, local cities, local names)

export const formatLKR = (amount) => {
  const n = Number(amount) || 0
  return 'Rs. ' + n.toLocaleString('en-LK', { maximumFractionDigits: 0 })
}

export const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ---- Reference data ----
export const branchList = [
  { code: 'B001', name: 'Colombo 01 – Fort', district: 'Colombo' },
  { code: 'B002', name: 'Kandy – Dalada Veediya', district: 'Kandy' },
  { code: 'B003', name: 'Galle – Lighthouse St', district: 'Galle' },
  { code: 'B004', name: 'Jaffna – Hospital Rd', district: 'Jaffna' },
  { code: 'B005', name: 'Negombo – Lewis Peiris Mw', district: 'Gampaha' },
  { code: 'B006', name: 'Matara – Anagarika Dharmapala Mw', district: 'Matara' },
  { code: 'B007', name: 'Kurunegala – Dambulla Rd', district: 'Kurunegala' },
  { code: 'B008', name: 'Gampaha – Yakkuruwela Jct', district: 'Gampaha' },
]

export const accountTypes = [
  { id: 'savings', name: 'Savings Account', minDeposit: 1000, fee: 'Nil', rate: '4.5% p.a.' },
  { id: 'current', name: 'Current Account', minDeposit: 5000, fee: 'Rs. 500/mo', rate: 'N/A' },
  { id: 'fixed', name: 'Fixed Deposit', minDeposit: 25000, fee: 'Nil', rate: '8.50% p.a. (12 mo)' },
  { id: 'nrn', name: 'NRN Account', minDeposit: 5000, fee: 'Nil', rate: '5.0% p.a.' },
]

export const loanProducts = [
  { id: 'personal', name: 'Personal Loan', maxAmount: 3000000, minAmount: 50000, rate: 14.5, maxTenure: 60, purpose: 'Wedding, travel, medical, education' },
  { id: 'home', name: 'Housing Loan', maxAmount: 50000000, minAmount: 1000000, rate: 9.5, maxTenure: 360, purpose: 'Purchase, construction, renovation' },
  { id: 'auto', name: 'Auto Loan', maxAmount: 15000000, minAmount: 500000, rate: 11.0, maxTenure: 84, purpose: 'New or used vehicle purchase' },
  { id: 'education', name: 'Education Loan', maxAmount: 5000000, minAmount: 100000, rate: 8.0, maxTenure: 120, purpose: 'Local or overseas tuition' },
  { id: 'business', name: 'Business Loan', maxAmount: 25000000, minAmount: 500000, rate: 12.5, maxTenure: 84, purpose: 'Working capital, expansion' },
  { id: 'gold', name: 'Gold Loan', maxAmount: 5000000, minAmount: 25000, rate: 16.0, maxTenure: 24, purpose: 'Quick cash against gold' },
]

export const documentTypes = [
  { id: 'nic', label: 'National ID / NIC', required: true },
  { id: 'proof_income', label: 'Salary Payslips (last 3 months)', required: true },
  { id: 'bank_stmt', label: 'Bank Statements (last 6 months)', required: true },
  { id: 'utility', label: 'Utility Bill (address proof)', required: true },
  { id: 'photo', label: 'Passport-size Photo', required: true },
  { id: 'business_reg', label: 'Business Registration (if self-employed)', required: false },
  { id: 'title_deed', label: 'Title Deed (for housing loan)', required: false },
  { id: 'quotation', label: 'Vehicle Quotation (for auto loan)', required: false },
]

export const notificationTemplates = [
  { id: 'n1', type: 'success', title: 'Application submitted', body: 'Your housing loan application HL-2024-0892 has been received and is under initial review.', time: '2024-05-12T09:14:00' },
  { id: 'n2', type: 'info', title: 'Document requested', body: 'Please upload a clear copy of your latest utility bill to continue processing.', time: '2024-05-12T11:40:00' },
  { id: 'n3', type: 'warning', title: 'EMI due reminder', body: 'Your personal loan EMI of Rs. 18,450 is due on 2024-05-20.', time: '2024-05-15T08:00:00' },
  { id: 'n4', type: 'success', title: 'Loan approved', body: 'Congratulations! Your auto loan AL-2024-0710 has been approved. Visit Galle branch to sign documents.', time: '2024-05-18T15:22:00' },
]

// ---- Customer accounts ----
export const customerAccounts = [
  { id: 'SAV-1001', type: 'Savings Account', balance: 845200, branch: 'Colombo 01 – Fort', opened: '2021-03-15' },
  { id: 'CUR-2051', type: 'Current Account', balance: 1200000, branch: 'Colombo 01 – Fort', opened: '2022-01-20' },
  { id: 'FD-3090', type: 'Fixed Deposit', balance: 2500000, branch: 'Kandy – Dalada Veediya', opened: '2023-06-10' },
]

// ---- Applications ----
export const applications = [
  {
    id: 'HL-2024-0892',
    type: 'Housing Loan',
    amount: 12500000,
    tenure: 240,
    rate: 9.5,
    status: 'under_review',
    stage: 2,
    submittedAt: '2024-05-12T09:14:00',
    applicant: 'Kavindya Perera',
    branch: 'Colombo 01 – Fort',
    officer: 'Nimal Silva',
    monthlyIncome: 185000,
    documents: [
      { id: 'nic', name: 'NIC_Front.pdf', uploaded: true, verified: true },
      { id: 'nic', name: 'NIC_Back.pdf', uploaded: true, verified: true },
      { id: 'proof_income', name: 'Payslip_Mar_2024.pdf', uploaded: true, verified: true },
      { id: 'proof_income', name: 'Payslip_Apr_2024.pdf', uploaded: true, verified: false },
      { id: 'bank_stmt', name: 'Statement_Jan_Jun.pdf', uploaded: true, verified: true },
      { id: 'utility', name: 'Electricity_Bill.pdf', uploaded: false, verified: false },
      { id: 'title_deed', name: 'Title_Deed_Deed.pdf', uploaded: true, verified: false },
    ],
  },
  {
    id: 'AL-2024-0710',
    type: 'Auto Loan',
    amount: 4200000,
    tenure: 60,
    rate: 11.0,
    status: 'approved',
    stage: 5,
    submittedAt: '2024-04-28T10:30:00',
    applicant: 'Kavindya Perera',
    branch: 'Galle – Lighthouse St',
    officer: 'Ruwan Fernando',
    monthlyIncome: 185000,
    documents: [
      { id: 'nic', name: 'NIC_Front.pdf', uploaded: true, verified: true },
      { id: 'nic', name: 'NIC_Back.pdf', uploaded: true, verified: true },
      { id: 'proof_income', name: 'Payslip_Mar_2024.pdf', uploaded: true, verified: true },
      { id: 'bank_stmt', name: 'Statement_Jan_Jun.pdf', uploaded: true, verified: true },
      { id: 'utility', name: 'Electricity_Bill.pdf', uploaded: true, verified: true },
      { id: 'quotation', name: 'Toyota_Aqua_Quote.pdf', uploaded: true, verified: true },
    ],
  },
  {
    id: 'PL-2024-0655',
    type: 'Personal Loan',
    amount: 500000,
    tenure: 36,
    rate: 14.5,
    status: 'pending_docs',
    stage: 1,
    submittedAt: '2024-05-20T14:05:00',
    applicant: 'Kavindya Perera',
    branch: 'Colombo 01 – Fort',
    officer: 'Nimal Silva',
    monthlyIncome: 185000,
    documents: [
      { id: 'nic', name: 'NIC_Front.pdf', uploaded: true, verified: false },
      { id: 'proof_income', name: 'Payslip_Mar_2024.pdf', uploaded: false, verified: false },
      { id: 'bank_stmt', name: 'Statement_Jan_Jun.pdf', uploaded: false, verified: false },
    ],
  },
]

export const applicationStages = [
  { id: 1, key: 'submitted', label: 'Submitted', description: 'Application received and queued' },
  { id: 2, key: 'under_review', label: 'Under Review', description: 'Loan officer verifying details' },
  { id: 3, key: 'compliance', label: 'Compliance Check', description: 'AML, KYC and credit checks' },
  { id: 4, key: 'manager_approval', label: 'Manager Approval', description: 'Branch manager review' },
  { id: 5, key: 'approved', label: 'Approved / Disbursed', description: 'Funds released to account' },
]

export const statusConfig = {
  pending_docs: { label: 'Pending Documents', color: 'warning', icon: 'FileWarning' },
  submitted: { label: 'Submitted', color: 'accent', icon: 'Send' },
  under_review: { label: 'Under Review', color: 'accent', icon: 'Eye' },
  compliance: { label: 'Compliance', color: 'accent', icon: 'ShieldCheck' },
  manager_approval: { label: 'Manager Approval', color: 'accent', icon: 'UserCheck' },
  approved: { label: 'Approved', color: 'success', icon: 'CheckCircle' },
  rejected: { label: 'Rejected', color: 'danger', icon: 'XCircle' },
  draft: { label: 'Draft', color: 'ink', icon: 'FileEdit' },
}

// ---- Staff queue (for staff portal) ----
export const staffQueue = [
  { id: 'HL-2024-0892', applicant: 'Kavindya Perera', product: 'Housing Loan', amount: 12500000, status: 'under_review', assignedTo: 'Nimal Silva', branch: 'Colombo 01 – Fort', submittedAt: '2024-05-12T09:14:00', risk: 'medium' },
  { id: 'PL-2024-0655', applicant: 'Kavindya Perera', product: 'Personal Loan', amount: 500000, status: 'pending_docs', assignedTo: 'Nimal Silva', branch: 'Colombo 01 – Fort', submittedAt: '2024-05-20T14:05:00', risk: 'low' },
  { id: 'BL-2024-0901', applicant: 'Saman Bandara', product: 'Business Loan', amount: 8500000, status: 'compliance', assignedTo: 'Ruwan Fernando', branch: 'Galle – Lighthouse St', submittedAt: '2024-05-18T11:20:00', risk: 'high' },
  { id: 'GL-2024-0888', applicant: 'Dilani Kumari', product: 'Gold Loan', amount: 750000, status: 'manager_approval', assignedTo: 'Tharaka Jayasuriya', branch: 'Kandy – Dalada Veediya', submittedAt: '2024-05-19T09:45:00', risk: 'low' },
  { id: 'AL-2024-0710', applicant: 'Kavindya Perera', product: 'Auto Loan', amount: 4200000, status: 'approved', assignedTo: 'Ruwan Fernando', branch: 'Galle – Lighthouse St', submittedAt: '2024-04-28T10:30:00', risk: 'low' },
  { id: 'EL-2024-0875', applicant: 'Ishara Madushani', product: 'Education Loan', amount: 1800000, status: 'under_review', assignedTo: 'Nimal Silva', branch: 'Negombo – Lewis Peiris Mw', submittedAt: '2024-05-17T13:10:00', risk: 'medium' },
  { id: 'HL-2024-0912', applicant: 'Pradeep Senanayake', product: 'Housing Loan', amount: 28000000, status: 'compliance', assignedTo: 'Ruwan Fernando', branch: 'Colombo 01 – Fort', submittedAt: '2024-05-21T08:30:00', risk: 'high' },
]

export const staffRoles = [
  { id: 'officer', name: 'Loan Officer', description: 'Review applications, verify documents, submit recommendations' },
  { id: 'compliance', name: 'Compliance Officer', description: 'AML, KYC and credit checks, risk scoring' },
  { id: 'manager', name: 'Branch Manager', description: 'Final approval authority for branch applications' },
  { id: 'admin', name: 'System Administrator', description: 'Manage products, rates, users and configuration' },
]

export const staffMembers = [
  { id: 'U001', name: 'Nimal Silva', role: 'officer', branch: 'Colombo 01 – Fort', email: 'nimal.silva@novabank.lk' },
  { id: 'U002', name: 'Ruwan Fernando', role: 'officer', branch: 'Galle – Lighthouse St', email: 'ruwan.fernando@novabank.lk' },
  { id: 'U003', name: 'Tharaka Jayasuriya', role: 'manager', branch: 'Kandy – Dalada Veediya', email: 'tharaka.j@novabank.lk' },
  { id: 'U004', name: 'Anusha Perera', role: 'compliance', branch: 'Head Office', email: 'anusha.p@novabank.lk' },
  { id: 'U005', name: 'Suresh Kanagaraj', role: 'admin', branch: 'Head Office', email: 'suresh.k@novabank.lk' },
]

export const loanProductsAdmin = [
  { id: 'personal', name: 'Personal Loan', rate: 14.5, min: 50000, max: 3000000, maxTenure: 60, active: true },
  { id: 'home', name: 'Housing Loan', rate: 9.5, min: 1000000, max: 50000000, maxTenure: 360, active: true },
  { id: 'auto', name: 'Auto Loan', risk: 11.0, rate: 11.0, min: 500000, max: 15000000, maxTenure: 84, active: true },
  { id: 'education', name: 'Education Loan', rate: 8.0, min: 100000, max: 5000000, maxTenure: 120, active: true },
  { id: 'business', name: 'Business Loan', rate: 12.5, min: 500000, max: 25000000, maxTenure: 84, active: true },
  { id: 'gold', name: 'Gold Loan', rate: 16.0, min: 25000, max: 5000000, maxTenure: 24, active: false },
]

// ---- Reporting data ----
export const monthlyDisbursements = [
  { month: 'Jan', amount: 142000000, count: 38 },
  { month: 'Feb', amount: 168000000, count: 45 },
  { month: 'Mar', amount: 155000000, count: 41 },
  { month: 'Apr', amount: 189000000, count: 52 },
  { month: 'May', amount: 210000000, count: 58 },
  { month: 'Jun', amount: 198000000, count: 55 },
]

export const productMix = [
  { name: 'Housing', value: 45, color: '#1f3864' },
  { name: 'Personal', value: 22, color: '#2e74b5' },
  { name: 'Auto', value: 15, color: '#4ea3e3' },
  { name: 'Business', value: 10, color: '#0f9aa3' },
  { name: 'Education', value: 5, color: '#1f9d57' },
  { name: 'Gold', value: 3, color: '#e0a317' },
]

export const branchPerformance = [
  { branch: 'Colombo 01', disbursed: 285000000, applications: 142, approvalRate: 78 },
  { branch: 'Kandy', disbursed: 168000000, applications: 98, approvalRate: 72 },
  { branch: 'Galle', disbursed: 142000000, applications: 84, approvalRate: 75 },
  { branch: 'Negombo', disbursed: 98000000, applications: 61, approvalRate: 69 },
  { branch: 'Matara', disbursed: 76000000, applications: 48, approvalRate: 71 },
  { branch: 'Kurunegala', disbursed: 89000000, applications: 55, approvalRate: 74 },
]

export const kpiCards = [
  { label: 'Total Disbursed (YTD)', value: 'Rs. 1.062 B', delta: '+12.4%', trend: 'up' },
  { label: 'Applications (MTD)', value: '58', delta: '+8', trend: 'up' },
  { label: 'Avg. Approval Rate', value: '73.8%', delta: '-1.2%', trend: 'down' },
  { label: 'Avg. Processing Time', value: '4.2 days', delta: '-0.6 days', trend: 'up' },
]
