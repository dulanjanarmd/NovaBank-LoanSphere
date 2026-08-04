// Centralized mock data and utilities for NovaBank LoanSphere
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

export const staffRoles = [
  { id: 'officer', name: 'Loan Officer', description: 'Review applications, verify documents, submit recommendations' },
  { id: 'compliance', name: 'Compliance Officer', description: 'AML, KYC and credit checks, risk scoring' },
  { id: 'manager', name: 'Branch Manager', description: 'Final approval authority for branch applications' },
  { id: 'admin', name: 'System Administrator', description: 'Manage products, rates, users and configuration' },
]
