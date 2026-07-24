import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, User, Building2, CreditCard, FileText, CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, UserCheck, Send, Download, Eye } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import StatusBadge from '../components/StatusBadge'
import { applications, formatLKR, formatDate } from '../data/mockData'

export default function StaffApplicationReview() {
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'officer')
  const [decision, setDecision] = useState('')
  const [notes, setNotes] = useState('')
  const app = applications[0]

  const roleActions = {
    officer: { label: 'Submit Recommendation', icon: Send, next: 'Forward to Compliance' },
    compliance: { label: 'Complete Compliance Check', icon: ShieldCheck, next: 'Forward to Manager' },
    manager: { label: 'Final Decision', icon: UserCheck, next: 'Approve or Reject' },
    admin: { label: 'Override / Comment', icon: UserCheck, next: 'Add comment' },
  }
  const action = roleActions[role] || roleActions.officer

  return (
    <StaffShell role={role} setRole={setRole} active="Application Review">
      <Link to="/staff" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
        <ArrowLeft className="h-4 w-4" /> Back to queue
      </Link>

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

          {/* Loan */}
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-navy-800">Loan Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={CreditCard} label="Product" value={app.type} />
              <Info icon={CreditCard} label="Amount" value={formatLKR(app.amount)} />
              <Info icon={Clock} label="Tenure" value={`${app.tenure} months`} />
              <Info icon={CreditCard} label="Interest rate" value={`${app.rate}% p.a.`} />
            </div>
            <div className="mt-4 rounded-lg bg-ink-50 p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><div className="text-xs text-ink-500">Monthly EMI</div><div className="text-sm font-bold text-navy-800">{formatLKR(app.amount * 0.008)}</div></div>
                <div><div className="text-xs text-ink-500">DTI Ratio</div><div className="text-sm font-bold text-navy-800">{Math.round((app.amount * 0.008 / app.monthlyIncome) * 100)}%</div></div>
                <div><div className="text-xs text-ink-500">Credit score</div><div className="text-sm font-bold text-navy-800">742</div></div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-navy-800">Documents</h2>
            <div className="space-y-2.5">
              {app.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${doc.uploaded ? 'bg-navy-50 text-navy-700' : 'bg-ink-100 text-ink-400'}`}><FileText className="h-4.5 w-4.5" /></div>
                    <div className="text-sm font-semibold text-navy-800">{doc.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.verified ? (
                      <span className="chip bg-success-50 text-success-700"><CheckCircle className="h-3.5 w-3.5" /> Verified</span>
                    ) : doc.uploaded ? (
                      <span className="chip bg-warning-50 text-warning-700"><Clock className="h-3.5 w-3.5" /> Pending</span>
                    ) : (
                      <span className="chip bg-danger-50 text-danger-700"><XCircle className="h-3.5 w-3.5" /> Missing</span>
                    )}
                    {doc.uploaded && <button className="btn-ghost p-1.5"><Eye className="h-3.5 w-3.5" /></button>}
                    {doc.uploaded && <button className="btn-ghost p-1.5"><Download className="h-3.5 w-3.5" /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action panel */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-5">
            <h2 className="mb-4 font-bold text-navy-800">Review & Decision</h2>

            {/* Risk assessment */}
            <div className="mb-4 rounded-xl bg-ink-50 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Risk Assessment</div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
                <span className="text-sm font-bold text-navy-800">Medium Risk</span>
              </div>
              <div className="mt-2 text-xs text-ink-500">DTI ratio within limits. Credit score good. Property valuation pending.</div>
            </div>

            {/* Decision */}
            <div className="mb-4">
              <label className="label">Decision</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setDecision('approve')} className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${decision === 'approve' ? 'border-success-500 bg-success-50 text-success-700' : 'border-ink-100 text-ink-600 hover:border-success-200'}`}>
                  <CheckCircle className="h-4 w-4" /> Approve
                </button>
                <button onClick={() => setDecision('reject')} className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${decision === 'reject' ? 'border-danger-500 bg-danger-50 text-danger-700' : 'border-ink-100 text-ink-600 hover:border-danger-200'}`}>
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="label">Review notes</label>
              <textarea className="input" rows="4" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add your review comments..." />
            </div>

            {/* Conditions (compliance role) */}
            {role === 'compliance' && (
              <div className="mb-4">
                <label className="label">Conditions</label>
                <div className="space-y-2">
                  {['AML check passed', 'KYC verified', 'Credit bureau clear', 'Income verified'].map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm text-ink-600">
                      <input type="checkbox" className="rounded border-ink-300" defaultChecked /> {c}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button disabled={!decision} className="btn-primary w-full disabled:opacity-40">
              <action.icon className="h-4 w-4" /> {action.label}
            </button>
            <button className="btn-outline mt-2 w-full">Save as draft</button>

            {/* Activity log */}
            <div className="mt-5 border-t border-ink-100 pt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Activity</div>
              <div className="space-y-2.5 text-xs">
                <div className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 text-success-600" /><span className="text-ink-600">Submitted by customer — {formatDate(app.submittedAt)}</span></div>
                <div className="flex gap-2"><Eye className="h-3.5 w-3.5 text-accent-600" /><span className="text-ink-600">Opened by {app.officer} — {formatDate(app.submittedAt)}</span></div>
                <div className="flex gap-2"><Clock className="h-3.5 w-3.5 text-warning-600" /><span className="text-ink-600">Awaiting compliance check</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  )
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-ink-50 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm"><Icon className="h-4.5 w-4.5" /></div>
      <div><div className="text-xs text-ink-500">{label}</div><div className="text-sm font-semibold text-navy-800">{value}</div></div>
    </div>
  )
}
