import { Link } from 'react-router-dom'
import { Wallet, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Plus, FileText, CreditCard, Bell, CheckCircle, AlertCircle } from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import StatusBadge from '../components/StatusBadge'
import { customerAccounts, applications, formatLKR, formatDate, notificationTemplates } from '../data/mockData'

export default function CustomerDashboard() {
  const totalBalance = customerAccounts.reduce((s, a) => s + a.balance, 0)
  const activeLoans = applications.filter((a) => a.status === 'approved')
  const pendingApps = applications.filter((a) => a.status !== 'approved' && a.status !== 'rejected')

  return (
    <div className="min-h-screen bg-ink-50">
      <CustomerHeader active="Dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Welcome */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Good afternoon, Kavindya</h1>
            <p className="text-sm text-ink-500">Here's a snapshot of your accounts and applications.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/portal/open-account" className="btn-outline"><Plus className="h-4 w-4" /> Open Account</Link>
            <Link to="/portal/apply" className="btn-primary"><CreditCard className="h-4 w-4" /> Apply for Loan</Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700"><Wallet className="h-5 w-5" /></div>
              <span className="chip bg-success-50 text-success-700"><ArrowUpRight className="h-3 w-3" /> +2.4%</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Total Balance</div>
            <div className="text-xl font-bold text-navy-800">{formatLKR(totalBalance)}</div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><TrendingUp className="h-5 w-5" /></div>
              <span className="chip bg-accent-50 text-accent-700">Active</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Active Loans</div>
            <div className="text-xl font-bold text-navy-800">{activeLoans.length}</div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-50 text-warning-600"><Clock className="h-5 w-5" /></div>
              <span className="chip bg-warning-50 text-warning-700">In progress</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Pending Applications</div>
            <div className="text-xl font-bold text-navy-800">{pendingApps.length}</div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><FileText className="h-5 w-5" /></div>
              <span className="chip bg-ink-100 text-ink-600">This month</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Total Applications</div>
            <div className="text-xl font-bold text-navy-800">{applications.length}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Accounts */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-ink-100 p-5">
              <h2 className="font-bold text-navy-800">My Accounts</h2>
              <button className="text-sm font-medium text-accent-600 hover:text-accent-700">View all</button>
            </div>
            <div className="divide-y divide-ink-50">
              {customerAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between p-5 transition-colors hover:bg-navy-50/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-700 text-white"><Wallet className="h-5 w-5" /></div>
                    <div>
                      <div className="text-sm font-semibold text-navy-800">{acc.type}</div>
                      <div className="text-xs text-ink-500">{acc.id} · {acc.branch}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-navy-800">{formatLKR(acc.balance)}</div>
                    <div className="text-xs text-ink-500">Opened {formatDate(acc.opened)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-ink-100 p-5">
              <h2 className="font-bold text-navy-800">Recent Notifications</h2>
              <Link to="/portal/notifications" className="text-sm font-medium text-accent-600 hover:text-accent-700">View all</Link>
            </div>
            <div className="divide-y divide-ink-50">
              {notificationTemplates.slice(0, 3).map((n) => {
                const Icon = n.type === 'success' ? CheckCircle : n.type === 'warning' ? AlertCircle : Bell
                const color = n.type === 'success' ? 'text-success-600' : n.type === 'warning' ? 'text-warning-600' : 'text-accent-600'
                return (
                  <div key={n.id} className="flex gap-3 p-4">
                    <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
                    <div>
                      <div className="text-sm font-semibold text-navy-800">{n.title}</div>
                      <div className="mt-0.5 text-xs text-ink-500">{n.body}</div>
                      <div className="mt-1 text-[11px] text-ink-400">{formatDate(n.time)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="card mt-6">
          <div className="flex items-center justify-between border-b border-ink-100 p-5">
            <h2 className="font-bold text-navy-800">My Applications</h2>
            <Link to="/portal/applications" className="text-sm font-medium text-accent-600 hover:text-accent-700">View all</Link>
          </div>
          <div className="divide-y divide-ink-50">
            {applications.map((app) => (
              <Link key={app.id} to={`/portal/applications/${app.id}`} className="flex items-center justify-between p-5 transition-colors hover:bg-navy-50/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><CreditCard className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold text-navy-800">{app.type}</div>
                    <div className="text-xs text-ink-500">{app.id} · Submitted {formatDate(app.submittedAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-navy-800">{formatLKR(app.amount)}</div>
                    <div className="text-xs text-ink-500">{app.tenure} months · {app.rate}%</div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
