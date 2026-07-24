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

  // Auth endpoints
  async login(username, password) {
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

  // Account endpoints
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

  // Loan endpoints
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

  // Document endpoints
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

  // Staff endpoints
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

  // Credit assessment endpoints
  async performCreditAssessment(applicationId) {
    return this.request(`/credit-assessment/application/${applicationId}`, {
      method: 'POST',
    })
  }

  async getCreditAssessment(applicationId) {
    return this.request(`/credit-assessment/application/${applicationId}`)
  }

  // Reporting endpoints
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

  // Notification endpoints
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
}

export const api = new ApiService()
