const API_BASE_URL = 'http://localhost:8080/api/v1'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const token = localStorage.getItem('token')

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let error
      try { error = await response.json() } catch { error = { message: 'API request failed' } }
      throw new Error(error.message || 'API request failed')
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/csv')) {
      return response.text()
    }

    return response.json()
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async staffLogin(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMyProfile() {
    return this.request('/auth/me')
  }

  async forgotPassword(identifier) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: identifier }),
    })
  }

  async verifyResetCode(identifier, code) {
    return this.request('/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email: identifier, code }),
    })
  }

  async resetPassword(identifier, code, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: identifier, code, newPassword }),
    })
  }

  // ── Accounts ──────────────────────────────────────────────────────────────

  async openAccount(data) {
    return this.request('/accounts/open', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCustomerAccounts(customerId) {
    return this.request(`/accounts/customer/${customerId}`)
  }

  async getAccountProducts() {
    return this.request('/accounts/products')
  }

  // ── Loans ─────────────────────────────────────────────────────────────────

  async submitLoanApplication(data) {
    return this.request('/loans/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async saveLoanDraft(data) {
    return this.request('/loans/draft', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCustomerApplications(customerId) {
    return this.request(`/loans/customer/${customerId}`)
  }

  async getApplicationDetail(applicationId) {
    return this.request(`/loans/${applicationId}`)
  }

  async calculateEmi(principal, rate, tenure) {
    return this.request(`/loans/emi-calculator?principal=${principal}&rate=${rate}&tenure=${tenure}`)
  }

  async signLoanAgreement(applicationId, otp) {
    return this.request(`/loans/${applicationId}/sign`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    })
  }

  async getRepaymentSchedule(applicationId) {
    return this.request(`/loans/${applicationId}/schedule`)
  }

  async getApplicationConditions(applicationId) {
    return this.request(`/loans/${applicationId}/conditions`)
  }

  async fulfillCondition(conditionId) {
    return this.request(`/loans/conditions/${conditionId}/fulfill`, {
      method: 'PUT',
    })
  }

  // ── Documents ─────────────────────────────────────────────────────────────

  async uploadDocument(data) {
    return this.request('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getApplicationDocuments(applicationId) {
    return this.request(`/documents/application/${applicationId}`)
  }

  async updateDocumentStatus(documentId, status, comment) {
    return this.request(`/documents/${documentId}/status?status=${status}${comment ? `&comment=${comment}` : ''}`, {
      method: 'PUT',
    })
  }

  // ── Staff ─────────────────────────────────────────────────────────────────

  async getStaffApplications(status, role) {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (role) params.append('role', role)
    return this.request(`/staff/applications?${params}`)
  }

  async getStaffApplicationDetail(applicationId) {
    return this.request(`/staff/applications/${applicationId}`)
  }

  async processApproval(applicationId, decision, comments) {
    return this.request(`/staff/applications/${applicationId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ decision, comments }),
    })
  }

  async disburseApplication(applicationId, accountNumber) {
    return this.request(`/staff/applications/${applicationId}/disburse`, {
      method: 'POST',
      body: JSON.stringify({ accountNumber }),
    })
  }

  // ── Credit Assessment ─────────────────────────────────────────────────────

  async performCreditAssessment(applicationId) {
    return this.request(`/credit-assessment/application/${applicationId}`, {
      method: 'POST',
    })
  }

  async getCreditAssessment(applicationId) {
    return this.request(`/credit-assessment/application/${applicationId}`)
  }

  // ── Reports ───────────────────────────────────────────────────────────────

  async getKPIs() {
    return this.request('/reports/kpi')
  }

  async getApplicationsByStatus() {
    return this.request('/reports/applications-by-status')
  }

  async getMonthlyDisbursements() {
    return this.request('/reports/monthly-disbursements')
  }

  async getProductMix() {
    return this.request('/reports/product-mix')
  }

  async getOperationalReport(params = {}) {
    const q = new URLSearchParams()
    if (params.from) q.append('from', params.from)
    if (params.to) q.append('to', params.to)
    if (params.loanType) q.append('loanType', params.loanType)
    if (params.status) q.append('status', params.status)
    return this.request(`/reports/operational?${q}`)
  }

  async getComplianceReport() {
    return this.request('/reports/compliance')
  }

  async getTATReport() {
    return this.request('/reports/tat')
  }

  async exportAuditCsv(from, to) {
    const q = new URLSearchParams()
    if (from) q.append('from', from)
    if (to) q.append('to', to)
    return this.request(`/reports/export-csv?${q}`)
  }

  // ── Notifications ──────────────────────────────────────────────────────────

  async getNotifications(customerId) {
    return this.request(`/notifications/customer/${customerId}`)
  }

  async getUnreadNotifications(customerId) {
    return this.request(`/notifications/customer/${customerId}/unread`)
  }

  async markAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    })
  }

  async markAllAsRead(customerId) {
    return this.request(`/notifications/customer/${customerId}/read-all`, {
      method: 'PUT',
    })
  }

  // ── Admin ─────────────────────────────────────────────────────────────────

  async getAdminProducts() {
    return this.request('/admin/products')
  }

  async createAdminProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateAdminProduct(id, productData) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteAdminProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    })
  }

  async getAdminUsers() {
    return this.request('/admin/users')
  }

  async createAdminUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateAdminUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteAdminUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    })
  }

  async getAdminAuditLogs() {
    return this.request('/admin/audit-logs')
  }

  // ── System Config (FR-ADM-03) ─────────────────────────────────────────────

  async getSystemConfig() {
    return this.request('/admin/config')
  }

  async updateSystemConfig(key, value) {
    return this.request(`/admin/config/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    })
  }

  async bulkUpdateSystemConfig(updates) {
    return this.request('/admin/config/bulk', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // ── Reports (FR-RPT-01, FR-RPT-02) ────────────────────────────────────────

  async getKpiReport(startDate, endDate) {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    return this.request(`/reports/kpi?${params.toString()}`)
  }

  async getOperationalReport(startDate, endDate, branch, product) {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    if (branch) params.append('branch', branch)
    if (product) params.append('product', product)
    return this.request(`/reports/operational?${params.toString()}`)
  }

  async getComplianceReport(startDate, endDate) {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    return this.request(`/reports/compliance?${params.toString()}`)
  }

  async exportOperationalReport(startDate, endDate, branch, product) {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    if (branch) params.append('branch', branch)
    if (product) params.append('product', product)
    return this.request(`/reports/export?${params.toString()}`)
  }

  // ── Integrations ──────────────────────────────────────────────────────────

  async performKycOcr(nicNumber) {
    return this.request('/integration/kyc/ocr', {
      method: 'POST',
      body: JSON.stringify({ nicNumber }),
    })
  }

  async performLivenessCheck() {
    return this.request('/integration/kyc/liveness', {
      method: 'POST',
    })
  }

  async screenWatchlist(fullName, nicNumber) {
    return this.request('/integration/kyc/screen', {
      method: 'POST',
      body: JSON.stringify({ fullName, nicNumber }),
    })
  }

  async fetchCribReport(nicNumber, customerId = 1) {
    return this.request(`/integration/crib/report?nicNumber=${nicNumber}&customerId=${customerId}`)
  }

  async verifyCbsAccount(accountNumber) {
    return this.request(`/integration/cbs/verify-account?accountNumber=${accountNumber}`)
  }

  async getRepaymentScheduleCalc(principal, annualRate, tenureMonths) {
    return this.request('/integration/cbs/repayment-schedule', {
      method: 'POST',
      body: JSON.stringify({ principal, annualRate, tenureMonths }),
    })
  }
}

export const api = new ApiService()
