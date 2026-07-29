import { Navigate } from 'react-router-dom'

export default function StaffAuthGuard({ children }) {
  const staffUser = localStorage.getItem('staffUser')
  if (!staffUser) {
    return <Navigate to="/staff/login" replace />
  }
  return children
}
