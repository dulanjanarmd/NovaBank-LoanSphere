import { Link } from 'react-router-dom'
import { Plus, CreditCard, Search, Filter } from 'lucide-react'
import { useState } from 'react'
import CustomerHeader from '../components/CustomerHeader'
import StatusBadge from '../components/StatusBadge'
import DataTable from '../components/DataTable'
import { applications, formatLKR, formatDate } from '../data/mockData'

export default function ApplicationsListPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = applications.filter((a) => {
    const matchFilter = filter === 'all' || a.status === filter
    const matchSearch = a.id.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const columns = [
    { key: 'id', label: 'Reference', sortable: true, render: (r) => <Link to={`/portal/applications/${r.id}`} className="font-semibold text-accent-600 hover:text-accent-700">{r.id}</Link> },
    { key: 'type', label: 'Product', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', render: (r) => <span className="font-semibold text-navy-800">{formatLKR(r.amount)}</span> },
    { key: 'tenure', label: 'Tenure', render: (r) => `${r.tenure} mo` },
    { key: 'rate', label: 'Rate', render: (r) => `${r.rate}%` },
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

        <div className="card mt-4">
          <DataTable columns={columns} rows={filtered} />
        </div>
      </main>
    </div>
  )
}
