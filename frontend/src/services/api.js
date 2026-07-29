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
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

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

  async submitLoanApplication(data) {
    return this.request('/loans/apply', {
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

  async performCreditAssessment(applicationId) {
    return this.request(`/credit-assessment/application/${applicationId}`, {
      method: 'POST',
    })
  }

  async getCreditAssessment(applicationId) {
    return this.request(`/credit-assessment/application/${applicationId}`)
  }

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

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async verifyResetCode(email, code) {
    return this.request('/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
  }

  async resetPassword(email, code, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    })
  }

  async getAdminProducts() {
    return this.request('/admin/products')
  }

  async updateAdminProduct(id, productData) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async getAdminUsers() {
    return this.request('/admin/users')
  }

  async getAdminAuditLogs() {
    return this.request('/admin/audit-logs')
  }

  // ── Integration Endpoints ─────────────────────────────────────────────────

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

  async getRepaymentSchedule(principal, annualRate, tenureMonths) {
    return this.request('/integration/cbs/repayment-schedule', {
      method: 'POST',
      body: JSON.stringify({ principal, annualRate, tenureMonths }),
    })
  }
}

export const api = new ApiService()
