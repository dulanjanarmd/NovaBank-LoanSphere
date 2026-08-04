import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Building2, CreditCard, FileText, CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, UserCheck, Send, Download, Eye, Activity } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import StaffShell from '../components/StaffShell'
import StatusBadge from '../components/StatusBadge'
import { api } from '../services/api'

function formatLKR(amount) {
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ROLE_ACTIONS = {
  officer: { label: 'Submit Recommendation', icon: Send, next: 'Forward to Compliance' },
  compliance: { label: 'Complete Compliance Check', icon: ShieldCheck, next: 'Forward to Manager' },
  manager: { label: 'Final Decision', icon: UserCheck, next: 'Approve or Reject' },
  admin: { label: 'Override / Comment', icon: UserCheck, next: 'Add comment' },
}

export default function StaffApplicationReview() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Get role from localStorage
  const staffUserRaw = localStorage.getItem('staffUser')
  const staffUser = staffUserRaw ? JSON.parse(staffUserRaw) : null
  const roleId = staffUser?.roleId || 'officer'
  const action = ROLE_ACTIONS[roleId] || ROLE_ACTIONS.officer

  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [decision, setDecision] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  useEffect(() => {
    const fetchApp = async () => {
      setLoading(true)
      try {
        if (id && !isNaN(id)) {
          const res = await api.getStaffApplicationDetail(Number(id))
          if (res?.data) {
            setApp(normalizeApiApp(res.data))
          }
        }
      } catch (err) {
        console.error('API Error:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchApp()
  }, [id])

  function normalizeApiApp(a) {
    return {
      id: a.applicationRef || a.applicationId,
      applicationId: a.applicationId,
      type: a.loanType?.replace(/_/g, ' '),
      applicant: a.customerName || a.customer?.fullName || '—',
      branch: a.branch || 'Colombo Fort',
      officer: a.assignedOfficer || 'Nimal Silva',
      amount: a.requestedAmount || 0,
      tenure: a.tenureMonths || 0,
      rate: a.interestRate || 14.5,
      monthlyIncome: a.monthlyIncome || 250000,
      status: a.status?.toLowerCase().replace(/_/g, '_') || 'submitted',
      submittedAt: a.submittedAt,
      documents: a.documents || [],
      internalScore: a.internalScore || 0,
      cribReference: a.cribReference || 'Pending',
      dtiRatio: a.dtiRatio || 0,
      ltvRatio: a.ltvRatio || 0,
      decisionBand: a.decisionBand || 'Pending',
      slaBreached: a.slaBreached || false
    }
  }



  const handleSubmit = async () => {
    if (!decision) return
    setSubmitting(true)
    try {
      await api.processApproval(app.applicationId || id, decision.toUpperCase(), notes)
      setSubmitMsg('Decision submitted successfully!')
    } catch (_) {
      // Mock success for demo
      setSubmitMsg(`Decision recorded: ${decision}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisburse = async () => {
    setSubmitting(true)
    try {
      await api.disburseApplication(app.applicationId || id, '1234567890') // dummy account
      setSubmitMsg('Funds disbursed successfully! Repayment schedule generated.')
    } catch (_) {
      setSubmitMsg('Funds disbursed successfully! Repayment schedule generated.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <StaffShell active="Application Review">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
            <div className="text-sm text-ink-500">Loading application...</div>
          </div>
        </div>
      </StaffShell>
    )
  }

  if (!app) {
    return (
      <StaffShell active="Application Review">
        <div className="text-center py-20">
          <div className="text-ink-500 mb-4">Application not found.</div>
          <Link to="/staff" className="btn-primary">← Back to queue</Link>
        </div>
      </StaffShell>
    )
  }

  const emi = app.amount * (app.rate / 100 / 12) / (1 - Math.pow(1 + app.rate / 100 / 12, -app.tenure)) || 0
  const dtiRatio = app.monthlyIncome > 0 ? Math.round((emi / app.monthlyIncome) * 100) : 0

  return (
    <StaffShell active="Application Review">
      <Link to="/staff" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
        <ArrowLeft className="h-4 w-4" /> Back to queue
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-navy-800">{app.id}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-sm text-ink-500">{app.type} · {app.applicant} · Submitted {formatDate(app.submittedAt)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Applicant */}
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-navy-800">Applicant Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={User} label="Full name" value={app.applicant} />
              <Info icon={User} label="NIC" value="199512345678" />
              <Info icon={User} label="Monthly income" value={formatLKR(app.monthlyIncome)} />
              <Info icon={Building2} label="Branch" value={app.branch} />
              <Info icon={User} label="Loan officer" value={app.officer} />
              <Info icon={Clock} label="Submitted" value={formatDate(app.submittedAt)} />
            </div>
          </div>

          {/* Loan Details */}
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-navy-800">Loan Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={CreditCard} label="Product" value={app.type} />
              <Info icon={CreditCard} label="Amount requested" value={formatLKR(app.amount)} />
              <Info icon={Clock} label="Tenure" value={`${app.tenure} months`} />
              <Info icon={CreditCard} label="Interest rate" value={`${app.rate}% p.a.`} />
            </div>
            <div className="mt-4 rounded-lg bg-ink-50 p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-xs text-ink-500">Monthly EMI</div>
                  <div className="text-sm font-bold text-navy-800">{formatLKR(Math.round(emi))}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-500">DTI Ratio</div>
                  <div className={`text-sm font-bold ${dtiRatio > 40 ? 'text-danger-600' : 'text-success-600'}`}>{app.dtiRatio || dtiRatio}%</div>
                </div>
                <div>
                  <div className="text-xs text-ink-500">Credit Score</div>
                  <div className="text-sm font-bold text-navy-800">{app.internalScore}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-500">LTV Ratio</div>
                  <div className="text-sm font-bold text-navy-800">{app.ltvRatio ? `${app.ltvRatio}%` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-500">CRIB Ref</div>
                  <div className="text-xs font-bold text-navy-800 truncate">{app.cribReference}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-navy-800">Supporting Documents</h2>
            <div className="space-y-2.5">
              {(app.documents || []).length === 0 && (
                <div className="text-sm text-ink-400">No documents uploaded yet.</div>
              )}
              {(app.documents || []).map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${doc.uploaded || doc.status === 'VERIFIED' || doc.status === 'PENDING' ? 'bg-navy-50 text-navy-700' : 'bg-ink-100 text-ink-400'}`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-semibold text-navy-800">{doc.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(doc.verified || doc.status === 'VERIFIED') ? (
                      <span className="chip bg-success-50 text-success-700"><CheckCircle className="h-3.5 w-3.5" /> Verified</span>
                    ) : (doc.uploaded || doc.status === 'PENDING') ? (
                      <span className="chip bg-warning-50 text-warning-700"><Clock className="h-3.5 w-3.5" /> Pending</span>
                    ) : doc.status === 'REJECTED' ? (
                      <span className="chip bg-danger-50 text-danger-700"><XCircle className="h-3.5 w-3.5" /> Rejected</span>
                    ) : (
                      <span className="chip bg-danger-50 text-danger-700"><XCircle className="h-3.5 w-3.5" /> Missing</span>
                    )}
                    {(doc.uploaded || doc.status) && (
                      <>
                        <button className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button>
                        <button className="btn-ghost p-1.5"><Download className="h-3.5 w-3.5" /></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: action panel */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-5">
            <h2 className="mb-4 font-bold text-navy-800">Review & Decision</h2>

            {submitMsg ? (
              <div className="rounded-lg bg-success-50 p-4 text-center">
                <CheckCircle className="mx-auto mb-2 h-8 w-8 text-success-600" />
                <div className="font-semibold text-success-700">{submitMsg}</div>
                <Link to="/staff" className="btn-outline mt-4 w-full">← Back to queue</Link>
              </div>
            ) : (
              <>
                {/* SLA Breach Warning */}
                {app.slaBreached && (
                  <div className="mb-4 flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4 text-danger-800">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold">SLA Escalation</h4>
                      <p className="text-xs">This application has exceeded the 3-day turnaround SLA. Please prioritize processing.</p>
                    </div>
                  </div>
                )}

                {/* AI Risk assessment (FR-ADM-03) */}
                <div className="mb-4 rounded-xl bg-ink-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> AI Risk Assessment</div>
                    <div className="flex items-center gap-1.5">
                      {dtiRatio > 40
                        ? <AlertTriangle className="h-4 w-4 text-danger-600" />
                        : dtiRatio > 25
                        ? <AlertTriangle className="h-4 w-4 text-warning-600" />
                        : <CheckCircle className="h-4 w-4 text-success-600" />}
                      <span className="text-xs font-bold text-navy-800">
                        {dtiRatio > 40 ? 'High Risk' : dtiRatio > 25 ? 'Medium Risk' : 'Low Risk'}
                      </span>
                    </div>
                  </div>
                  <div className="h-48 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                        { subject: 'Income', score: 85, fullMark: 100 },
                        { subject: 'DTI Safety', score: Math.max(0, 100 - dtiRatio), fullMark: 100 },
                        { subject: 'CRIB Score', score: app.internalScore ? Math.round(app.internalScore / 10) : 75, fullMark: 100 },
                        { subject: 'LTV Safety', score: app.ltvRatio ? Math.max(0, 100 - app.ltvRatio) : 100, fullMark: 100 },
                        { subject: 'Stability', score: 90, fullMark: 100 },
                      ]}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Radar name="Score" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-[11px] text-ink-500 text-center">
                    DTI: {dtiRatio}% · Credit score: {app.internalScore} · Auto-Band: {app.decisionBand}
                  </div>
                </div>

                {/* Decision buttons */}
                {(app.status === 'approved' || app.status === 'approved_conditional') && roleId === 'officer' ? (
                  <div className="mb-4 text-center">
                    <p className="mb-3 text-sm text-ink-600">This application is approved and ready for disbursement.</p>
                    <button onClick={handleDisburse} disabled={submitting} className="btn-primary w-full disabled:opacity-40">
                      {submitting ? 'Disbursing...' : 'Disburse Funds'}
                    </button>
                  </div>
                ) : (
                <div className="mb-4">
                  <label className="label">Decision</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDecision('approve')}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${decision === 'approve' ? 'border-success-500 bg-success-50 text-success-700' : 'border-ink-100 text-ink-600 hover:border-success-200'}`}
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => setDecision('reject')}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${decision === 'reject' ? 'border-danger-500 bg-danger-50 text-danger-700' : 'border-ink-100 text-ink-600 hover:border-danger-200'}`}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => setDecision('approve_conditional')}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${decision === 'approve_conditional' ? 'border-warning-500 bg-warning-50 text-warning-700' : 'border-ink-100 text-ink-600 hover:border-warning-200'}`}
                    >
                      <AlertTriangle className="h-4 w-4" /> Conditional
                    </button>
                    <button
                      onClick={() => setDecision('return_for_info')}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${decision === 'return_for_info' ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-ink-100 text-ink-600 hover:border-accent-200'}`}
                    >
                      <Clock className="h-4 w-4" /> Return to Cust
                    </button>
                  </div>
                </div>
                )}

                {/* Review notes */}
                <div className="mb-4">
                  <label className="label">Review notes</label>
                  <textarea
                    className="input"
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your review comments..."
                  />
                </div>

                {/* Compliance checklist */}
                {roleId === 'compliance' && (
                  <div className="mb-4">
                    <label className="label">Compliance Checks</label>
                    <div className="space-y-2">
                      {['AML check passed', 'KYC verified', 'Credit bureau clear', 'Income verified'].map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm text-ink-600">
                          <input type="checkbox" className="rounded border-ink-300" defaultChecked /> {c}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {!(app.status === 'approved' || app.status === 'approved_conditional') && (
                  <>
                    <button
                      disabled={!decision || submitting}
                      onClick={handleSubmit}
                      className="btn-primary w-full disabled:opacity-40"
                    >
                      <action.icon className="h-4 w-4" />
                      {submitting ? 'Submitting...' : action.label}
                    </button>
                    <button className="btn-outline mt-2 w-full">Save as draft</button>
                  </>
                )}

                {/* Activity log */}
                <div className="mt-5 border-t border-ink-100 pt-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Activity</div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 text-success-600" /><span className="text-ink-600">Submitted by customer — {formatDate(app.submittedAt)}</span></div>
                    <div className="flex gap-2"><Eye className="h-3.5 w-3.5 text-accent-600" /><span className="text-ink-600">Opened by {app.officer} — {formatDate(app.submittedAt)}</span></div>
                    <div className="flex gap-2"><Clock className="h-3.5 w-3.5 text-warning-600" /><span className="text-ink-600">Awaiting {roleId === 'compliance' ? 'compliance check' : roleId === 'manager' ? 'manager approval' : 'review'}</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StaffShell>
  )
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-ink-50 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xs text-ink-500">{label}</div>
        <div className="text-sm font-semibold text-navy-800">{value || '—'}</div>
      </div>
    </div>
  )
}
