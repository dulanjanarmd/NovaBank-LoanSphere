import { Home, Inbox, ShieldCheck, UserCheck, Settings, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Logo from './Logo'

const NAV_BY_ROLE = {
  officer: [
    { to: '/staff', label: 'Work Queue', icon: Inbox },
  ],
  compliance: [
    { to: '/staff', label: 'Compliance Queue', icon: ShieldCheck },
    { to: '/staff/reports', label: 'Reports', icon: BarChart3 },
  ],
  manager: [
    { to: '/staff', label: 'Approval Queue', icon: UserCheck },
    { to: '/staff/reports', label: 'Reports', icon: BarChart3 },
  ],
  admin: [
    { to: '/staff', label: 'Dashboard', icon: Home },
    { to: '/staff/admin', label: 'Product & Rates', icon: Settings },
    { to: '/staff/reports', label: 'Reports', icon: BarChart3 },
  ],
}

const ROLE_LABELS = {
  LOAN_OFFICER: 'Loan Officer',
  COMPLIANCE_OFFICER: 'Compliance Officer',
  BRANCH_MANAGER: 'Branch Manager',
  ADMIN: 'System Administrator',
  officer: 'Loan Officer',
  compliance: 'Compliance Officer',
  manager: 'Branch Manager',
  admin: 'System Administrator',
}

export default function StaffShell({ children, active }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Read staff user from localStorage
  const staffUserRaw = localStorage.getItem('staffUser')
  const staffUser = staffUserRaw ? JSON.parse(staffUserRaw) : null
  const roleId = staffUser?.roleId || 'officer'
  const roleName = ROLE_LABELS[staffUser?.role] || ROLE_LABELS[roleId] || 'Staff'
  const fullName = staffUser?.fullName || 'Staff User'
  const branch = staffUser?.branch || ''
  const initials = fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const nav = NAV_BY_ROLE[roleId] || NAV_BY_ROLE.officer

  const handleLogout = () => {
    localStorage.removeItem('staffToken')
    localStorage.removeItem('staffUser')
    navigate('/staff/login')
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy-800 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight text-white">NovaBank</div>
              <div className="text-[10px] font-medium text-navy-300">Staff Portal</div>
            </div>
          </Link>
          <button className="lg:hidden text-white" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        {/* User info */}
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">{initials}</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{fullName}</div>
              <div className="truncate text-[11px] text-navy-300">{roleName}</div>
              {branch && <div className="truncate text-[10px] text-navy-400">{branch}</div>}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="p-4">
          <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-navy-400">Navigation</div>
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              const isActive = active === item.label || (item.to === '/staff' && location.pathname === '/staff')
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-navy-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 border-t border-white/10 pt-4 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-300 hover:bg-white/5 hover:text-white"
            >
              <Home className="h-4 w-4" /> Customer Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-400 hover:bg-white/5 hover:text-danger-300"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200 bg-white px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden btn-ghost p-2" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
            <div>
              <div className="text-sm font-semibold text-navy-800">{roleName} Workspace</div>
              <div className="text-[11px] text-ink-500">{branch}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-navy-800">{fullName}</span>
              <span className="text-[11px] text-ink-500">{roleName}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">{initials}</div>
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-1.5 text-danger-600 hover:bg-danger-50 px-3 py-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </div>
  )
}
