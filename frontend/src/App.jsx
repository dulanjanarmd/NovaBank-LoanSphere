import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProfilePage from './pages/ProfilePage'
import CustomerDashboard from './pages/CustomerDashboard'
import OpenAccountPage from './pages/OpenAccountPage'
import ApplyLoanPage from './pages/ApplyLoanPage'
import ApplicationsListPage from './pages/ApplicationsListPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import StaffLoginPage from './pages/StaffLoginPage'
import StaffDashboard from './pages/StaffDashboard'
import StaffApplicationReview from './pages/StaffApplicationReview'
import StaffAdminPage from './pages/StaffAdminPage'
import StaffReportsPage from './pages/StaffReportsPage'
import AuthGuard from './components/AuthGuard'
import StaffAuthGuard from './components/StaffAuthGuard'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage initialMode="register" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Customer Portal (requires customer auth) */}
      <Route path="/portal/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
      <Route path="/portal/dashboard" element={<AuthGuard><CustomerDashboard /></AuthGuard>} />
      <Route path="/portal/open-account" element={<AuthGuard><OpenAccountPage /></AuthGuard>} />
      <Route path="/portal/apply" element={<AuthGuard><ApplyLoanPage /></AuthGuard>} />
      <Route path="/portal/applications" element={<AuthGuard><ApplicationsListPage /></AuthGuard>} />
      <Route path="/portal/applications/:id" element={<AuthGuard><ApplicationDetailPage /></AuthGuard>} />
      <Route path="/portal/notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />

      {/* Staff Portal */}
      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/staff" element={<StaffAuthGuard><StaffDashboard /></StaffAuthGuard>} />
      <Route path="/staff/application/:id" element={<StaffAuthGuard><StaffApplicationReview /></StaffAuthGuard>} />
      <Route path="/staff/application" element={<StaffAuthGuard><StaffApplicationReview /></StaffAuthGuard>} />
      <Route path="/staff/admin" element={<StaffAuthGuard><StaffAdminPage /></StaffAuthGuard>} />
      <Route path="/staff/reports" element={<StaffAuthGuard><StaffReportsPage /></StaffAuthGuard>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
