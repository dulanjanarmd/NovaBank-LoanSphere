import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/portal/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
      <Route path="/portal/dashboard" element={<AuthGuard><CustomerDashboard /></AuthGuard>} />
      <Route path="/portal/open-account" element={<AuthGuard><OpenAccountPage /></AuthGuard>} />
      <Route path="/portal/apply" element={<AuthGuard><ApplyLoanPage /></AuthGuard>} />
      <Route path="/portal/applications" element={<AuthGuard><ApplicationsListPage /></AuthGuard>} />
      <Route path="/portal/applications/:id" element={<AuthGuard><ApplicationDetailPage /></AuthGuard>} />
      <Route path="/portal/notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />

      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/staff/application" element={<StaffApplicationReview />} />
      <Route path="/staff/admin" element={<StaffAdminPage />} />
      <Route path="/staff/reports" element={<StaffReportsPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
