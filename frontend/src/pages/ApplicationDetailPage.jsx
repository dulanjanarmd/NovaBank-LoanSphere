import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ArrowLeft, FileText, CheckCircle, Clock, XCircle, Upload, AlertCircle,
  User, Building2, CreditCard, PenTool, Shield, Calendar, TrendingUp,
  AlertTriangle, Lock
} from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import StatusBadge from '../components/StatusBadge'
import Stepper from '../components/Stepper'
import { applications, applicationStages, formatLKR, formatDate, formatDateTime } from '../data/mockData'
import { api } from '../services/api'

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [conditions, setConditions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [eSignModal, setESignModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [eSigning, setESigning] = useState(false)
  const [eSignError, setESignError] = useState('')
  const [eSignSuccess, setESignSuccess] = useState(false)

  useEffect(() => {
    const fetchApp = async () => {
      try {
        if (id && !isNaN(id)) {
          const res = await api.getApplicationDetail(Number(id))
          if (res?.data) {
            setApp(normalizeApiApp(res.data))
            // Fetch repayment schedule
            try {
              const schedRes = await api.getRepaymentSchedule(Number(id))
              if (schedRes?.data) setSchedule(schedRes.data)
            } catch (_) {}
            // Fetch conditions
            try {
              const condRes = await api.getApplicationConditions(Number(id))
              if (condRes?.data) setConditions(condRes.data)
            } catch (_) {}
            setLoading(false)
            return
          }
        }
      } catch (_) {}
      const found = applications.find((a) => a.id === id)
      setApp(found || null)
      setLoading(false)
    }
    fetchApp()
  }, [id])

  function normalizeApiApp(a) {
    return {
      id: a.applicationRef || id,
      apiId: a.applicationId,
      type: a.loanType?.replace(/_/g, ' '),
      amount: a.requestedAmount,
      tenure: a.tenureMonths,
      rate: a.interestRate || 14.5,
      status: a.status?.toLowerCase(),
      stage: stageFromStatus(a.status),
      rawStatus: a.status,
      applicant: a.customerName || 'Customer',
      branch: a.branch || '—',
      officer: a.assignedOfficer || '—',
      monthlyIncome: a.monthlyIncome || 0,
      submittedAt: a.submittedAt,
      documents: a.documents || [],
      slaBreached: a.slaBreached || false,
      eSigned: a.eSigned || false,
      eSignedAt: a.eSignedAt,
      collateralValue: a.collateralValue,
      purpose: a.purpose,
    }
  }
  function stageFromStatus(s) {
    const map = { SUBMITTED: 1, UNDER_REVIEW: 2, APPROVED_CONDITIONAL: 3, APPROVED: 4, SIGNED: 4, DISBURSED: 5, REJECTED: 1 }
    return map[s] || 1
  }

  async function handleESign() {
    if (!otp || otp.length < 4) { setESignError('Please enter your OTP.'); return }
    setESigning(true)
    setESignError('')
    try {
      const appId = app?.apiId || Number(id)
      await api.signLoanAgreement(appId, otp)
      setESignSuccess(true)
      setESignModal(false)
      setApp(prev => ({ ...prev, eSigned: true, rawStatus: 'SIGNED', status: 'signed' }))
    } catch (e) {
      setESignError(e.message || 'Signing failed. Please try again.')
    } finally {
      setESigning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-100">
        <CustomerHeader />
        <main className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
            <div className="text-sm text-ink-500">Loading application...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-100">
        <CustomerHeader />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-ink-300" />
          <h1 className="mt-4 text-xl font-bold text-navy-800">Application not found</h1>
          <Link to="/portal/applications" className="mt-4 inline-block btn-primary">Back to Applications</Link>
        </main>
      </div>
    )
  }

  const uploadedDocs = (app.documents || []).filter((d) => d.uploaded).length
  const verifiedDocs = (app.documents || []).filter((d) => d.verified).length
  const totalDocs = (app.documents || []).length
  const canSign = (app.rawStatus === 'APPROVED' || app.rawStatus === 'APPROVED_CONDITIONAL') && !app.eSigned
  const showSchedule = schedule.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <CustomerHeader active="My Applications" />

      {/* e-Signature Modal */}
      {eSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
                <PenTool className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-800">e-Sign Loan Agreement</h3>
                <p className="text-sm text-ink-500">Enter the OTP sent to your mobile</p>
              </div>
            </div>
            <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <strong>Demo mode:</strong> Use OTP <code className="font-mono bg-white px-1 rounded">123456</code> to sign.
            </div>
            <label className="label">OTP Code</label>
            <input
              id="otp-input"
              className="input text-center text-2xl tracking-widest"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="— — — — — —"
            />
            {eSignError && <p className="mt-2 text-sm text-danger-600">{eSignError}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setESignModal(false); setOtp(''); setESignError('') }} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleESign} disabled={eSigning} className="btn-primary flex-1 disabled:opacity-50">
                {eSigning ? 'Signing...' : 'Confirm & Sign'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link to="/portal/applications" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to applications
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-navy-800">{app.id}</h1>
              <StatusBadge status={app.status} />
              {app.slaBreached && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-100 px-3 py-1 text-xs font-semibold text-danger-700">
                  <AlertTriangle className="h-3.5 w-3.5" /> SLA Breached
                </span>
              )}
              {app.eSigned && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-700">
                  <CheckCircle className="h-3.5 w-3.5" /> e-Signed
                </span>
              )}
              {eSignSuccess && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-700">
                  <CheckCircle className="h-3.5 w-3.5" /> Agreement Signed!
                </span>
              )}
            </div>
            <p className="text-sm text-ink-500">{app.type} · Submitted {formatDateTime(app.submittedAt)}</p>
          </div>

          {/* e-Sign CTA */}
          {canSign && (
            <button
              id="esign-btn"
              onClick={() => setESignModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-navy-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-all"
            >
              <PenTool className="h-4 w-4" /> e-Sign Agreement
            </button>
          )}
        </div>

        {/* Progress tracker */}
        <div className="card mt-6 p-6">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-ink-400">Application Progress</h2>
          <Stepper currentStage={app.stage} />
          <div className="mt-6 rounded-lg bg-ink-50 p-4 text-sm text-ink-600">
            <div className="font-semibold text-navy-800">{applicationStages[app.stage - 1]?.label}</div>
            <div className="mt-0.5">{applicationStages[app.stage - 1]?.description}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-xl bg-ink-100 p-1">
          {[
            { id: 'details', label: 'Loan Details' },
            { id: 'documents', label: `Documents ${totalDocs > 0 ? `(${verifiedDocs}/${totalDocs})` : ''}` },
            ...(showSchedule ? [{ id: 'schedule', label: 'Repayment Schedule' }] : []),
            ...(conditions.length > 0 ? [{ id: 'conditions', label: `Conditions (${conditions.filter(c => c.fulfilled).length}/${conditions.length})` }] : []),
            { id: 'timeline', label: 'Timeline' },
          ].map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-navy-800 shadow-sm' : 'text-ink-500 hover:text-navy-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="card p-6">
              <h2 className="mb-4 font-bold text-navy-800">Loan Details</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Detail icon={CreditCard} label="Product" value={app.type} />
                <Detail icon={CreditCard} label="Amount" value={formatLKR(app.amount)} />
                <Detail icon={Clock} label="Tenure" value={`${app.tenure} months`} />
                <Detail icon={TrendingUp} label="Interest rate" value={`${app.rate}% p.a.`} />
                <Detail icon={User} label="Applicant" value={app.applicant} />
                <Detail icon={Building2} label="Branch" value={app.branch} />
                {app.purpose && <Detail icon={FileText} label="Purpose" value={app.purpose} />}
                {app.collateralValue && <Detail icon={Shield} label="Collateral Value" value={formatLKR(app.collateralValue)} />}
                {app.eSignedAt && <Detail icon={Lock} label="e-Signed At" value={formatDateTime(app.eSignedAt)} />}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-navy-800">Documents</h2>
                <div className="text-xs text-ink-500">{uploadedDocs}/{totalDocs} uploaded · {verifiedDocs} verified</div>
              </div>
              {totalDocs === 0 ? (
                <p className="text-sm text-ink-500 text-center py-8">No documents attached to this application.</p>
              ) : (
                <div className="space-y-2.5">
                  {app.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${doc.uploaded ? 'bg-navy-50 text-navy-700' : 'bg-ink-100 text-ink-400'}`}>
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-navy-800">{doc.name}</div>
                          <div className="text-xs text-ink-500">{doc.uploaded ? (doc.verified ? 'Verified' : 'Pending verification') : 'Not uploaded'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.verified ? (
                          <span className="chip bg-success-50 text-success-700"><CheckCircle className="h-3.5 w-3.5" /> Verified</span>
                        ) : doc.uploaded ? (
                          <span className="chip bg-warning-50 text-warning-700"><Clock className="h-3.5 w-3.5" /> Pending</span>
                        ) : (
                          <>
                            <span className="chip bg-danger-50 text-danger-700"><XCircle className="h-3.5 w-3.5" /> Missing</span>
                            <button className="btn-outline px-2.5 py-1.5 text-xs"><Upload className="h-3.5 w-3.5" /> Upload</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Repayment Schedule Tab (FR-DIS-03) */}
          {activeTab === 'schedule' && showSchedule && (
            <div className="card p-6">
              <h2 className="mb-4 font-bold text-navy-800">Repayment Schedule</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-xs font-semibold uppercase text-ink-400">
                      <th className="pb-3 text-left">#</th>
                      <th className="pb-3 text-right">Due Date</th>
                      <th className="pb-3 text-right">EMI</th>
                      <th className="pb-3 text-right">Principal</th>
                      <th className="pb-3 text-right">Interest</th>
                      <th className="pb-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    {schedule.map((item) => (
                      <tr key={item.installmentNo} className="hover:bg-ink-50/50 transition-colors">
                        <td className="py-2.5 text-ink-500">{item.installmentNo}</td>
                        <td className="py-2.5 text-right font-medium text-navy-800">
                          <div className="flex items-center justify-end gap-1">
                            <Calendar className="h-3.5 w-3.5 text-ink-400" />
                            {item.dueDate}
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-semibold text-navy-800">{formatLKR(item.emiAmount)}</td>
                        <td className="py-2.5 text-right text-ink-600">{formatLKR(item.principalAmount)}</td>
                        <td className="py-2.5 text-right text-danger-600">{formatLKR(item.interestAmount)}</td>
                        <td className="py-2.5 text-right text-ink-500">{formatLKR(item.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Conditions Tab (FR-UW-04) */}
          {activeTab === 'conditions' && conditions.length > 0 && (
            <div className="card p-6">
              <h2 className="mb-4 font-bold text-navy-800">Conditional Approval Requirements</h2>
              <p className="mb-4 text-sm text-ink-500">All conditions must be fulfilled before disbursement.</p>
              <div className="space-y-3">
                {conditions.map((c) => (
                  <div key={c.conditionId} className={`flex items-start gap-3 rounded-lg border p-4 ${c.fulfilled ? 'border-success-200 bg-success-50' : 'border-warning-200 bg-warning-50'}`}>
                    <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${c.fulfilled ? 'bg-success-500 text-white' : 'bg-warning-200 text-warning-700'}`}>
                      {c.fulfilled ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${c.fulfilled ? 'text-success-700 line-through' : 'text-warning-800'}`}>{c.description}</p>
                      {c.fulfilled && c.fulfilledBy && (
                        <p className="mt-1 text-xs text-success-600">Fulfilled by {c.fulfilledBy}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="card p-6">
              <h2 className="mb-4 font-bold text-navy-800">Application Timeline</h2>
              <div className="space-y-4">
                {[
                  { title: 'Application submitted', desc: 'Received and queued for review', done: true, date: app.submittedAt },
                  { title: 'Initial review started', desc: `Assigned to loan officer`, done: app.stage >= 2 },
                  { title: 'Compliance & credit check', desc: 'AML and CRIB checks in progress', done: app.stage >= 3 },
                  { title: 'Manager approval', desc: 'Awaiting branch manager decision', done: app.stage >= 4 },
                  { title: app.eSigned ? 'Agreement e-Signed' : 'e-Signature pending', desc: app.eSigned ? `Signed on ${formatDateTime(app.eSignedAt)}` : 'Customer must sign loan agreement', done: app.eSigned },
                  { title: 'Disbursed', desc: 'Funds released to account', done: app.rawStatus === 'DISBURSED' },
                ].map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${event.done ? 'bg-success-500 text-white' : 'bg-ink-100 text-ink-400'}`}>
                        {event.done ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                      </div>
                      {i < 5 && <div className={`mt-1 h-8 w-0.5 ${event.done ? 'bg-success-200' : 'bg-ink-100'}`} />}
                    </div>
                    <div className="pb-2">
                      <div className={`text-sm font-semibold ${event.done ? 'text-navy-800' : 'text-ink-400'}`}>{event.title}</div>
                      <div className="text-xs text-ink-500">{event.desc}</div>
                      {event.done && event.date && <div className="mt-0.5 text-[11px] text-ink-400">{formatDateTime(event.date)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-ink-50 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <div className="text-xs text-ink-500">{label}</div>
        <div className="text-sm font-semibold text-navy-800">{value}</div>
      </div>
    </div>
  )
}
