import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Eye, CheckCircle, Clock, AlertTriangle, TrendingUp, Users, FileText, CheckSquare, ShieldCheck } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import StatusBadge from '../components/StatusBadge'
import DataTable from '../components/DataTable'
import { staffQueue, formatLKR, formatDate } from '../data/mockData'

export default function StaffDashboard() {
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'officer')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const r = searchParams.get('role')
    if (r) setRole(r)
  }, [searchParams])

  // Role-specific queue filtering
  const roleStatusMap = {
    officer: ['pending_docs', 'under_review'],
    compliance: ['compliance'],
    manager: ['manager_approval'],
    admin: ['pending_docs', 'under_review', 'compliance', 'manager_approval', 'approved'],
  }
  const allowedStatuses = roleStatusMap[role] || []
  const queue = staffQueue.filter((q) => {
    const matchRole = allowedStatuses.includes(q.status)
    const matchFilter = filter === 'all' || q.status === filter
    const matchSearch = q.id.toLowerCase().includes(search.toLowerCase()) || q.applicant.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchFilter && matchSearch
  })

  const stats = {
    officer: [
      { label: 'My Queue', value: queue.length, icon: FileText, color: 'navy' },
      { label: 'Pending Docs', value: staffQueue.filter((q) => q.status === 'pending_docs').length, icon: AlertTriangle, color: 'warning' },
      { label: 'Under Review', value: staffQueue.filter((q) => q.status === 'under_review').length, icon: Clock, color: 'accent' },
      { label: 'Approved (mo)', value: staffQueue.filter((q) => q.status === 'approved').length, icon: CheckCircle, color: 'success' },
    ],
    compliance: [
      { label: 'Compliance Queue', value: staffQueue.filter((q) => q.status === 'compliance').length, icon: ShieldCheck, color: 'navy' },
      { label: 'High Risk', value: staffQueue.filter((q) => q.risk === 'high').length, icon: AlertTriangle, color: 'danger' },
      { label: 'Medium Risk', value: staffQueue.filter((q) => q.risk === 'medium').length, icon: Clock, color: 'warning' },
      { label: 'Total Pipeline', value: staffQueue.length, icon: TrendingUp, color: 'accent' },
    ],
    manager: [
      { label: 'Awaiting Approval', value: staffQueue.filter((q) => q.status === 'manager_approval').length, icon: CheckSquare, color: 'navy' },
      { label: 'Total Value', value: formatLKR(staffQueue.filter((q) => q.status === 'manager_approval').reduce((s, q) => s + q.amount, 0)), icon: TrendingUp, color: 'accent' },
      { label: 'Approved (mo)', value: staffQueue.filter((q) => q.status === 'approved').length, icon: CheckCircle, color: 'success' },
      { label: 'Avg. Approval', value: '73.8%', icon: Users, color: 'teal' },
    ],
    admin: [
      { label: 'Total Applications', value: staffQueue.length, icon: FileText, color: 'navy' },
      { label: 'In Pipeline', value: staffQueue.filter((q) => !['approved', 'rejected'].includes(q.status)).length, icon: Clock, color: 'accent' },
      { label: 'Approved', value: staffQueue.filter((q) => q.status === 'approved').length, icon: CheckCircle, color: 'success' },
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
    { key: 'id', label: 'Reference', sortable: true, render: (r) => <Link to="/staff/application" className="font-semibold text-accent-600 hover:text-accent-700">{r.id}</Link> },
    { key: 'applicant', label: 'Applicant', sortable: true, render: (r) => <span className="font-medium text-navy-800">{r.applicant}</span> },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', render: (r) => <span className="font-semibold text-navy-800">{formatLKR(r.amount)}</span> },
    { key: 'risk', label: 'Risk', render: (r) => <RiskBadge risk={r.risk} /> },
    { key: 'branch', label: 'Branch' },
    { key: 'submittedAt', label: 'Submitted', sortable: true, render: (r) => formatDate(r.submittedAt) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: () => <Link to="/staff/application" className="btn-ghost px-2.5 py-1.5 text-xs"><Eye className="h-3.5 w-3.5" /> Review</Link> },
  ]

  const filters = [...new Set(staffQueue.filter((q) => allowedStatuses.includes(q.status)).map((q) => q.status))]

  return (
    <StaffShell role={role} setRole={setRole} active={role === 'admin' ? 'Dashboard' : role === 'compliance' ? 'Compliance Queue' : role === 'manager' ? 'Approval Queue' : 'Work Queue'}>
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
            <input className="input pl-9" placeholder="Search by reference or applicant..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
