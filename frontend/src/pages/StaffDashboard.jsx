import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Eye, CheckCircle, Clock, AlertTriangle, TrendingUp, Users, FileText, CheckSquare, ShieldCheck } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import StatusBadge from '../components/StatusBadge'
import DataTable from '../components/DataTable'
import { api } from '../services/api'

function formatLKR(amount) {
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Map API statuses to display-friendly values
function normalizeStatus(s) {
  if (!s) return 'submitted'
  return s.toLowerCase().replace(/_/g, '_')
}

export default function StaffDashboard() {
  // Read role from localStorage (set at staff login)
  const staffUserRaw = localStorage.getItem('staffUser')
  const staffUser = staffUserRaw ? JSON.parse(staffUserRaw) : null
  const roleId = staffUser?.roleId || 'officer'

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.getStaffApplications(null, roleId)
        setApplications(response?.data || [])
      } catch (err) {
        console.warn('API unavailable:', err.message)
        setApplications([])
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [roleId])

  const queue = applications.filter((q) => {
    const matchFilter = filter === 'all' || q.status === filter
    const matchSearch =
      !search ||
      (q.applicationRef?.toLowerCase().includes(search.toLowerCase())) ||
      (q.loanType?.toLowerCase().includes(search.toLowerCase())) ||
      (q.customerName?.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  const stats = {
    officer: [
      { label: 'My Queue', value: queue.length, icon: FileText, color: 'navy' },
      { label: 'Under Review', value: applications.filter((q) => q.status === 'UNDER_REVIEW').length, icon: Clock, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => ['APPROVED', 'DISBURSED'].includes(q.status)).length, icon: CheckCircle, color: 'success' },
      { label: 'Pending Docs', value: applications.filter((q) => q.status === 'PENDING_DOCS').length, icon: AlertTriangle, color: 'warning' },
    ],
    compliance: [
      { label: 'Compliance Queue', value: queue.length, icon: ShieldCheck, color: 'navy' },
      { label: 'Under Review', value: applications.filter((q) => q.status === 'UNDER_REVIEW').length, icon: Clock, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => ['APPROVED', 'DISBURSED'].includes(q.status)).length, icon: CheckCircle, color: 'success' },
      { label: 'Total Pipeline', value: applications.length, icon: TrendingUp, color: 'teal' },
    ],
    manager: [
      { label: 'Awaiting Approval', value: applications.filter((q) => q.status === 'UNDER_REVIEW').length, icon: CheckSquare, color: 'navy' },
      { label: 'Total Value', value: formatLKR(applications.reduce((s, q) => s + (q.requestedAmount || 0), 0)), icon: TrendingUp, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => ['APPROVED', 'DISBURSED'].includes(q.status)).length, icon: CheckCircle, color: 'success' },
      { label: 'Avg. Approval', value: '73.8%', icon: Users, color: 'teal' },
    ],
    admin: [
      { label: 'Total Applications', value: applications.length, icon: FileText, color: 'navy' },
      { label: 'In Pipeline', value: applications.filter((q) => !['APPROVED', 'REJECTED', 'DISBURSED'].includes(q.status)).length, icon: Clock, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => ['APPROVED', 'DISBURSED'].includes(q.status)).length, icon: CheckCircle, color: 'success' },
      { label: 'Active Products', value: '6', icon: TrendingUp, color: 'teal' },
    ],
  }

  const currentStats = stats[roleId] || stats.officer
  const colorMap = {
    navy: 'bg-navy-50 text-navy-700',
    accent: 'bg-accent-50 text-accent-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
    teal: 'bg-teal-50 text-teal-600',
  }

  const columns = [
    {
      key: 'applicationRef',
      label: 'Reference',
      sortable: true,
      render: (r) => (
        <Link to={`/staff/application/${r.applicationId || r.applicationRef}`} className="font-semibold text-accent-600 hover:text-accent-700">
          {r.applicationRef}
        </Link>
      ),
    },
    { key: 'customerName', label: 'Applicant', sortable: true, render: (r) => r.customerName || '—' },
    { key: 'loanType', label: 'Product', sortable: true, render: (r) => r.loanType?.replace(/_/g, ' ') },
    {
      key: 'requestedAmount',
      label: 'Amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-semibold text-navy-800">{formatLKR(r.requestedAmount)}</span>,
    },
    { key: 'submittedAt', label: 'Submitted', sortable: true, render: (r) => formatDate(r.submittedAt) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <Link to={`/staff/application/${r.applicationId || r.applicationRef}`} className="btn-ghost px-2.5 py-1.5 text-xs">
          <Eye className="h-3.5 w-3.5" /> Review
        </Link>
      ),
    },
  ]

  const uniqueStatuses = [...new Set(applications.map((q) => q.status).filter(Boolean))]
  const activeLabel = { officer: 'Work Queue', compliance: 'Compliance Queue', manager: 'Approval Queue', admin: 'Dashboard' }[roleId] || 'Work Queue'

  return (
    <StaffShell active={activeLabel}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
            <div className="text-sm text-ink-500">Loading applications...</div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {currentStats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="card p-5">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[s.color]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs font-medium text-ink-500">{s.label}</div>
                  <div className="text-xl font-bold text-navy-800">{s.value}</div>
                </div>
              )
            })}
          </div>

          {/* Filter & search bar */}
          <div className="mt-6 card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                <input
                  className="input pl-9"
                  placeholder="Search by reference, product or applicant..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-ink-400" />
                <button
                  onClick={() => setFilter('all')}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${filter === 'all' ? 'bg-navy-700 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
                >
                  All
                </button>
                {uniqueStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${filter === s ? 'bg-navy-700 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
                  >
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications table */}
          <div className="mt-4 card">
            <DataTable columns={columns} rows={queue} emptyMessage="No applications in your queue" />
          </div>
        </>
      )}
    </StaffShell>
  )
}
