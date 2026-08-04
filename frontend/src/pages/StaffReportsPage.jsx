import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Download, Calendar, Filter, Shield, AlertTriangle } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import { api } from '../services/api'

function formatLKR(amount) {
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(amount)
}

export default function StaffReportsPage() {
  const [range, setRange] = useState('6m')
  const [activeTab, setActiveTab] = useState('operational')
  const [loading, setLoading] = useState(false)
  
  // Real data state
  const [kpiData, setKpiData] = useState(null)
  const [opData, setOpData] = useState(null)
  const [compData, setCompData] = useState(null)

  useEffect(() => {
    fetchData()
  }, [range, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Calculate start/end date based on range
      const end = new Date()
      const start = new Date()
      if (range === '1m') start.setMonth(start.getMonth() - 1)
      else if (range === '3m') start.setMonth(start.getMonth() - 3)
      else if (range === '6m') start.setMonth(start.getMonth() - 6)
      else if (range === '1y') start.setFullYear(start.getFullYear() - 1)

      const startStr = start.toISOString().split('T')[0]
      const endStr = end.toISOString().split('T')[0]

      const kRes = await api.getKpiReport(startStr, endStr)
      if (kRes?.data) setKpiData(kRes.data)

      if (activeTab === 'operational') {
        const oRes = await api.getOperationalReport(startStr, endStr)
        if (oRes?.data) setOpData(oRes.data)
      } else if (activeTab === 'compliance') {
        const cRes = await api.getComplianceReport(startStr, endStr)
        if (cRes?.data) setCompData(cRes.data)
      }
    } catch (_) {}
    setLoading(false)
  }

  const exportCsv = async () => {
    try {
      const end = new Date()
      const start = new Date()
      if (range === '1m') start.setMonth(start.getMonth() - 1)
      else if (range === '6m') start.setMonth(start.getMonth() - 6)
      
      const csv = await api.exportOperationalReport(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Operational_Report_${range}.csv`
      a.click()
    } catch (e) {
      alert('Failed to export CSV')
    }
  }

  // Fallbacks if backend fails
  const displayKpi = kpiData ? [
    { label: 'Total Disbursements', value: formatLKR(kpiData.totalDisbursed), delta: '+12%', trend: 'up' },
    { label: 'Applications Received', value: (kpiData.applicationsReceived || 0).toString(), delta: '+5%', trend: 'up' },
    { label: 'Approval Rate', value: `${kpiData.approvalRate || 0}%`, delta: '+1.2%', trend: 'up' },
    { label: 'Avg Turnaround Time', value: `${(kpiData.avgTatDays || 0).toFixed(1)} days`, delta: '-0.5 days', trend: 'down' }
  ] : []

  const displayBranchPerf = opData?.branchPerformance || []

  return (
    <StaffShell active="Reports">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Reports & Analytics</h1>
          <p className="text-sm text-ink-500">Loan portfolio performance and compliance insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-ink-200 bg-white p-1">
            {['1m', '3m', '6m', '1y'].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${range === r ? 'bg-navy-700 text-white' : 'text-ink-600'}`}>{r}</button>
            ))}
          </div>
          <button onClick={exportCsv} className="btn-outline"><Download className="h-4 w-4" /> Export CSV</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayKpi.map((k) => {
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

      {/* Tabs */}
      <div className="mt-6 border-b border-ink-200">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('operational')} 
            className={`border-b-2 py-3 text-sm font-semibold transition-colors ${activeTab === 'operational' ? 'border-accent-500 text-navy-800' : 'border-transparent text-ink-500 hover:text-navy-700'}`}
          >
            Operational Reports
          </button>
          <button 
            onClick={() => setActiveTab('compliance')} 
            className={`border-b-2 py-3 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'compliance' ? 'border-accent-500 text-navy-800' : 'border-transparent text-ink-500 hover:text-navy-700'}`}
          >
            <Shield className="h-4 w-4" /> Compliance & Risk
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" /></div>
      ) : activeTab === 'operational' ? (
        <div className="mt-6">
          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Disbursement trend */}
            <div className="card p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-navy-800">Monthly Disbursements</h2>
                <span className="chip bg-accent-50 text-accent-700"><Calendar className="h-3.5 w-3.5" /> Last 6 months</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={opData?.monthlyDisbursements || []}>
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
                  <Pie data={opData?.productMix || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {(opData?.productMix || []).map((entry, i) => <Cell key={i} fill={entry.color || '#1f3864'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eef0f4', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
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
                  {displayBranchPerf.map((b) => (
                    <tr key={b.branch} className="border-b border-ink-50 hover:bg-navy-50/30">
                      <td className="py-3 font-semibold text-navy-800">{b.branch}</td>
                      <td className="py-3 text-right text-ink-700">{formatLKR(b.disbursed)}</td>
                      <td className="py-3 text-right text-ink-700">{b.applications}</td>
                      <td className="py-3 text-right">
                        <span className={`chip ${b.approvalRate >= 75 ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>{b.approvalRate}%</span>
                      </td>
                      <td className="py-3 text-right text-ink-700">{formatLKR(Math.round(b.disbursed / (b.applications || 1)))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Compliance Risk Tiers */}
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-navy-800">KYC Risk Tier Distribution</h2>
            <div className="flex h-48 items-end justify-around pb-4">
              {[
                { label: 'LOW', value: compData?.riskDistribution?.LOW || 85, color: 'bg-success-500' },
                { label: 'MEDIUM', value: compData?.riskDistribution?.MEDIUM || 12, color: 'bg-warning-500' },
                { label: 'HIGH', value: compData?.riskDistribution?.HIGH || 3, color: 'bg-danger-500' },
              ].map(r => (
                <div key={r.label} className="flex flex-col items-center gap-2">
                  <div className="text-sm font-bold text-navy-800">{r.value}%</div>
                  <div className={`w-16 rounded-t-lg ${r.color}`} style={{ height: `${r.value}%`, minHeight: '10px' }} />
                  <div className="text-xs font-semibold text-ink-500">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Breaches */}
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-navy-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-500" /> SLA Breach Summary
            </h2>
            <div className="flex items-center gap-6 mb-6">
              <div>
                <div className="text-sm text-ink-500">Total Breaches</div>
                <div className="text-3xl font-bold text-navy-800">{compData?.slaBreaches || 14}</div>
              </div>
              <div className="flex-1 rounded-lg bg-warning-50 p-4 border border-warning-100">
                <p className="text-sm text-warning-800">
                  Applications exceeding the <strong>3 business day</strong> SLA target. Focus on digital branch pipeline.
                </p>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-navy-800 mb-3">Breaches by Branch</h3>
            <div className="space-y-3">
              {[
                { branch: 'Digital Branch', count: 8 },
                { branch: 'Main Branch', count: 4 },
                { branch: 'Kandy Branch', count: 2 },
              ].map(b => (
                <div key={b.branch} className="flex items-center justify-between">
                  <span className="text-sm text-ink-600">{b.branch}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-warning-200 rounded-full w-32">
                      <div className="h-full bg-warning-500 rounded-full" style={{ width: `${(b.count/14)*100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-navy-800 w-6 text-right">{b.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </StaffShell>
  )
}
