import { Link } from 'react-router-dom'
import { Home, FileText, CreditCard, Bell, LogOut, User, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'
import { TrustBar } from './Logo'

export default function CustomerHeader({ active }) {
  const [open, setOpen] = useState(false)
  const navItems = [
    { to: '/portal/dashboard', label: 'Dashboard', icon: Home },
    { to: '/portal/applications', label: 'My Applications', icon: FileText },
    { to: '/portal/apply', label: 'Apply for Loan', icon: CreditCard },
    { to: '/portal/notifications', label: 'Notifications', icon: Bell },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.label
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-navy-50 text-navy-800' : 'text-ink-600 hover:bg-ink-50 hover:text-navy-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/staff" className="hidden items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-50 sm:inline-flex">
            <Settings className="h-3.5 w-3.5" /> Staff Portal
          </Link>
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">KP</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-navy-800">Kavindya Perera</div>
              <div className="text-[11px] text-ink-500">Retail Customer</div>
            </div>
          </div>
          <Link to="/" className="btn-ghost p-2 text-ink-500" title="Sign out"><LogOut className="h-4.5 w-4.5" /></Link>
          <button className="lg:hidden btn-ghost p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-ink-100 bg-white px-4 py-2 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
