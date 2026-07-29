import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Download, Calendar, Filter } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import { monthlyDisbursements, productMix, branchPerformance, kpiCards, formatLKR } from '../data/mockData'

export default function StaffReportsPage() {
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'compliance')
  const [range, setRange] = useState('6m')

  return (
    <StaffShell role={role} setRole={setRole} active="Reports">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Reports & Analytics</h1>
          <p className="text-sm text-ink-500">Loan portfolio performance and branch insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-ink-200 bg-white p-1">
            {['1m', '3m', '6m', '1y'].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${range === r ? 'bg-navy-700 text-white' : 'text-ink-600'}`}>{r}</button>
            ))}
          </div>
          <button className="btn-outline"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((k) => {
          const Icon = k.trend === 'up' ? TrendingUp : TrendingDown
          return (
            <div key={k.label} className="card p-5">
              <div className="text-xs font-medium text-ink-500">{k.label}</div>
              <div className="mt-1 text-2xl font-bold text-navy-800">{k.value}</div>
              <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${k.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                <Icon className="h-3.5 w-3.5" /> {k.delta}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Disbursement trend */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-navy-800">Monthly Disbursements</h2>
            <span className="chip bg-accent-50 text-accent-700"><Calendar className="h-3.5 w-3.5" /> Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyDisbursements}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6f7a91' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6f7a91' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip formatter={(v) => formatLKR(v)} contentStyle={{ borderRadius: 8, border: '1px solid #eef0f4', fontSize: 12 }} />
              <Bar dataKey="amount" fill="#1f3864" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product mix */}
        <div className="card p-6">
          <h2 className="mb-4 font-bold text-navy-800">Product Mix</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={productMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {productMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eef0f4', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch performance */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 font-bold text-navy-800">Branch Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={branchPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
              <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#6f7a91' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6f7a91' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eef0f4', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="applications" stroke="#2e74b5" strokeWidth={2} dot={{ r: 4 }} name="Applications" />
              <Line type="monotone" dataKey="approvalRate" stroke="#1f9d57" strokeWidth={2} dot={{ r: 4 }} name="Approval Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-bold text-navy-800">Top Branches</h2>
          <div className="space-y-3">
            {branchPerformance.sort((a, b) => b.disbursed - a.disbursed).slice(0, 5).map((b, i) => (
              <div key={b.branch} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? 'bg-warning-500 text-white' : 'bg-ink-100 text-ink-600'}`}>{i + 1}</div>
                  <span className="text-sm font-semibold text-navy-800">{b.branch}</span>
                </div>
                <span className="text-sm font-bold text-navy-800">{formatLKR(b.disbursed)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="mt-6 card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-navy-800">Branch Breakdown</h2>
          <button className="btn-outline text-xs"><Filter className="h-3.5 w-3.5" /> Filter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-400">
                <th className="py-3 font-semibold">Branch</th>
                <th className="py-3 text-right font-semibold">Disbursed</th>
                <th className="py-3 text-right font-semibold">Applications</th>
                <th className="py-3 text-right font-semibold">Approval Rate</th>
                <th className="py-3 text-right font-semibold">Avg. Ticket</th>
              </tr>
            </thead>
            <tbody>
              {branchPerformance.map((b) => (
                <tr key={b.branch} className="border-b border-ink-50 hover:bg-navy-50/30">
                  <td className="py-3 font-semibold text-navy-800">{b.branch}</td>
                  <td className="py-3 text-right text-ink-700">{formatLKR(b.disbursed)}</td>
                  <td className="py-3 text-right text-ink-700">{b.applications}</td>
                  <td className="py-3 text-right">
                    <span className={`chip ${b.approvalRate >= 75 ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>{b.approvalRate}%</span>
                  </td>
                  <td className="py-3 text-right text-ink-700">{formatLKR(Math.round(b.disbursed / b.applications))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaffShell>
  )
}
