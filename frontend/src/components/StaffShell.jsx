import { Home, Inbox, ShieldCheck, UserCheck, Settings, BarChart3, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Logo from './Logo'
import { staffRoles } from '../data/mockData'

export default function StaffShell({ role, setRole, children, active }) {
  const [open, setOpen] = useState(false)
  const [roleMenu, setRoleMenu] = useState(false)
  const location = useLocation()

  const navByRole = {
    officer: [
      { to: '/staff', label: 'Work Queue', icon: Inbox },
      { to: '/staff/application', label: 'Application Review', icon: Home },
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
  const nav = navByRole[role] || navByRole.officer
  const currentRole = staffRoles.find((r) => r.id === role)

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-100 bg-white transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5 text-ink-500" /></button>
        </div>
        <div className="p-4">
          <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Staff Portal</div>
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
                    isActive ? 'bg-navy-700 text-white' : 'text-ink-600 hover:bg-navy-50'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" /> {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-6 border-t border-ink-100 pt-4">
            <Link to="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50">
              <LogOut className="h-4.5 w-4.5" /> Exit to Customer Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden btn-ghost p-2" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
            <div>
              <div className="text-sm font-semibold text-navy-800">{currentRole?.name} Workspace</div>
              <div className="text-[11px] text-ink-500">{currentRole?.description}</div>
            </div>
          </div>
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
              onClick={() => setRoleMenu(!roleMenu)}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                {currentRole?.name?.[0]}
              </div>
              <span className="hidden sm:inline">{currentRole?.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {roleMenu && (
              <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-ink-100 bg-white p-1.5 shadow-cardHover">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Switch role</div>
                {staffRoles.map((r) => (
                  <button
                    key={r.id}
                    className={`flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-navy-50 ${role === r.id ? 'bg-navy-50' : ''}`}
                    onClick={() => { setRole(r.id); setRoleMenu(false) }}
                  >
                    <div>
                      <div className="font-semibold text-navy-800">{r.name}</div>
                      <div className="text-[11px] text-ink-500">{r.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
