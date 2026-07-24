import { Link } from 'react-router-dom'
import { Plus, CreditCard, Search, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import CustomerHeader from '../components/CustomerHeader'
import StatusBadge from '../components/StatusBadge'
import DataTable from '../components/DataTable'
import { api } from '../services/api'

function formatLKR(amount) {
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ApplicationsListPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData?.customerId) {
          const response = await api.getCustomerApplications(userData.customerId)
          setApplications(response.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filtered = applications.filter((a) => {
    const matchFilter = filter === 'all' || a.status === filter
    const matchSearch = a.applicationRef?.toLowerCase().includes(search.toLowerCase()) || a.loanType?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const columns = [
    { key: 'applicationRef', label: 'Reference', sortable: true, render: (r) => <Link to={`/portal/applications/${r.applicationId}`} className="font-semibold text-accent-600 hover:text-accent-700">{r.applicationRef}</Link> },
    { key: 'loanType', label: 'Product', sortable: true },
    { key: 'requestedAmount', label: 'Amount', sortable: true, align: 'right', render: (r) => <span className="font-semibold text-navy-800">{formatLKR(r.requestedAmount)}</span> },
    { key: 'tenureMonths', label: 'Tenure', render: (r) => `${r.tenureMonths} mo` },
    { key: 'submittedAt', label: 'Submitted', sortable: true, render: (r) => formatDate(r.submittedAt) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  const filters = ['all', 'pending_docs', 'under_review', 'compliance', 'manager_approval', 'approved']

  return (
    <div className="min-h-screen bg-ink-50">
      <CustomerHeader active="My Applications" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">My Applications</h1>
            <p className="text-sm text-ink-500">Track all your loan and account applications in one place.</p>
          </div>
          <Link to="/portal/apply" className="btn-primary"><Plus className="h-4 w-4" /> New Application</Link>
        </div>

        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
              <input className="input pl-9" placeholder="Search by reference or product..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 text-ink-400" />
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${filter === f ? 'bg-navy-700 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>
                  {f === 'all' ? 'All' : f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card mt-4 flex items-center justify-center py-12">
            <div className="text-ink-500">Loading applications...</div>
          </div>
        ) : (
          <div className="card mt-4">
            <DataTable columns={columns} rows={filtered} emptyMessage="No applications found" />
          </div>
        )}
      </main>
    </div>
  )
}
