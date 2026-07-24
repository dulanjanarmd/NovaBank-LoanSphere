import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Eye, CheckCircle, Clock, AlertTriangle, TrendingUp, Users, FileText, CheckSquare, ShieldCheck } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import StatusBadge from '../components/StatusBadge'
import DataTable from '../components/DataTable'
import { api } from '../services/api'

function formatLKR(amount) {
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function StaffDashboard() {
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'officer')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const r = searchParams.get('role')
    if (r) setRole(r)
  }, [searchParams])

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.getStaffApplications(null, role)
        setApplications(response.data || [])
      } catch (err) {
        console.error('Failed to fetch staff applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [role])

  const queue = applications.filter((q) => {
    const matchFilter = filter === 'all' || q.status === filter
    const matchSearch = q.applicationRef?.toLowerCase().includes(search.toLowerCase()) || q.loanType?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    officer: [
      { label: 'My Queue', value: queue.length, icon: FileText, color: 'navy' },
      { label: 'Under Review', value: applications.filter((q) => q.status === 'UNDER_REVIEW').length, icon: Clock, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => q.status === 'APPROVED').length, icon: CheckCircle, color: 'success' },
      { label: 'Rejected', value: applications.filter((q) => q.status === 'REJECTED').length, icon: AlertTriangle, color: 'danger' },
    ],
    compliance: [
      { label: 'Compliance Queue', value: queue.length, icon: ShieldCheck, color: 'navy' },
      { label: 'Under Review', value: applications.filter((q) => q.status === 'UNDER_REVIEW').length, icon: Clock, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => q.status === 'APPROVED').length, icon: CheckCircle, color: 'success' },
      { label: 'Total Pipeline', value: applications.length, icon: TrendingUp, color: 'teal' },
    ],
    manager: [
      { label: 'Awaiting Approval', value: applications.filter((q) => q.status === 'UNDER_REVIEW').length, icon: CheckSquare, color: 'navy' },
      { label: 'Total Value', value: formatLKR(applications.reduce((s, q) => s + (q.requestedAmount || 0), 0)), icon: TrendingUp, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => q.status === 'APPROVED').length, icon: CheckCircle, color: 'success' },
      { label: 'Avg. Approval', value: '73.8%', icon: Users, color: 'teal' },
    ],
    admin: [
      { label: 'Total Applications', value: applications.length, icon: FileText, color: 'navy' },
      { label: 'In Pipeline', value: applications.filter((q) => !['APPROVED', 'REJECTED'].includes(q.status)).length, icon: Clock, color: 'accent' },
      { label: 'Approved', value: applications.filter((q) => q.status === 'APPROVED').length, icon: CheckCircle, color: 'success' },
      { label: 'Active Products', value: '5', icon: TrendingUp, color: 'teal' },
    ],
  }

  const currentStats = stats[role] || stats.officer
  const colorMap = {
    navy: 'bg-navy-50 text-navy-700',
    accent: 'bg-accent-50 text-accent-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
    teal: 'bg-teal-50 text-teal-600',
  }

  const columns = [
    { key: 'applicationRef', label: 'Reference', sortable: true, render: (r) => <Link to={`/staff/application/${r.applicationId}`} className="font-semibold text-accent-600 hover:text-accent-700">{r.applicationRef}</Link> },
    { key: 'loanType', label: 'Product', sortable: true },
    { key: 'requestedAmount', label: 'Amount', sortable: true, align: 'right', render: (r) => <span className="font-semibold text-navy-800">{formatLKR(r.requestedAmount)}</span> },
    { key: 'submittedAt', label: 'Submitted', sortable: true, render: (r) => formatDate(r.submittedAt) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: (r) => <Link to={`/staff/application/${r.applicationId}`} className="btn-ghost px-2.5 py-1.5 text-xs"><Eye className="h-3.5 w-3.5" /> Review</Link> },
  ]

  const filters = [...new Set(applications.map((q) => q.status))]

  return (
    <StaffShell role={role} setRole={setRole} active={role === 'admin' ? 'Dashboard' : role === 'compliance' ? 'Compliance Queue' : role === 'manager' ? 'Approval Queue' : 'Work Queue'}>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-ink-500">Loading...</div>
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {currentStats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[s.color]}`}><Icon className="h-5 w-5" /></div>
              </div>
              <div className="mt-3 text-xs font-medium text-ink-500">{s.label}</div>
              <div className="text-xl font-bold text-navy-800">{s.value}</div>
            </div>
          )
        })}
      </div>

      {/* Queue */}
      <div className="mt-6 card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
            <input className="input pl-9" placeholder="Search by reference or product..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 text-ink-400" />
            <button onClick={() => setFilter('all')} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${filter === 'all' ? 'bg-navy-700 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>All</button>
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold capitalize ${filter === f ? 'bg-navy-700 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>{f.replace('_', ' ')}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 card">
        <DataTable columns={columns} rows={queue} emptyMessage="No applications in your queue" />
      </div>
        </>
      )}
    </StaffShell>
  )
}

function RiskBadge({ risk }) {
  const config = {
    low: { color: 'bg-success-50 text-success-700', icon: CheckCircle },
    medium: { color: 'bg-warning-50 text-warning-700', icon: Clock },
    high: { color: 'bg-danger-50 text-danger-700', icon: AlertTriangle },
  }
  const c = config[risk] || config.low
  const Icon = c.icon
  return <span className={`chip ${c.color} capitalize`}><Icon className="h-3.5 w-3.5" /> {risk}</span>
}
