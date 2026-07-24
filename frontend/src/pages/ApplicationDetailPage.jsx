import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, Upload, Download, AlertCircle, User, Building2, CreditCard } from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import StatusBadge from '../components/StatusBadge'
import Stepper from '../components/Stepper'
import { applications, applicationStages, formatLKR, formatDate, formatDateTime } from '../data/mockData'

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const app = applications.find((a) => a.id === id)

  if (!app) {
    return (
      <div className="min-h-screen bg-ink-50">
        <CustomerHeader />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-ink-300" />
          <h1 className="mt-4 text-xl font-bold text-navy-800">Application not found</h1>
          <Link to="/portal/applications" className="mt-4 inline-block btn-primary">Back to Applications</Link>
        </main>
      </div>
    )
  }

  const uploadedDocs = app.documents.filter((d) => d.uploaded).length
  const verifiedDocs = app.documents.filter((d) => d.verified).length
  const totalDocs = app.documents.length

  return (
    <div className="min-h-screen bg-ink-50">
      <CustomerHeader active="My Applications" />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link to="/portal/applications" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to applications
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy-800">{app.id}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-sm text-ink-500">{app.type} · Submitted {formatDateTime(app.submittedAt)}</p>
          </div>
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

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Loan details */}
            <div className="card p-6">
              <h2 className="mb-4 font-bold text-navy-800">Loan Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail icon={CreditCard} label="Product" value={app.type} />
                <Detail icon={CreditCard} label="Amount" value={formatLKR(app.amount)} />
                <Detail icon={Clock} label="Tenure" value={`${app.tenure} months`} />
                <Detail icon={CreditCard} label="Interest rate" value={`${app.rate}% p.a.`} />
                <Detail icon={User} label="Applicant" value={app.applicant} />
                <Detail icon={Building2} label="Branch" value={app.branch} />
              </div>
            </div>

            {/* Documents */}
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-navy-800">Documents</h2>
                <div className="text-xs text-ink-500">{uploadedDocs}/{totalDocs} uploaded · {verifiedDocs} verified</div>
              </div>
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
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-1">
            <div className="card p-5">
              <h2 className="mb-4 font-bold text-navy-800">Timeline</h2>
              <div className="space-y-4">
                {[
                  { date: app.submittedAt, title: 'Application submitted', desc: 'Received and queued for review', done: true },
                  { date: '2024-05-13T10:00:00', title: 'Initial review started', desc: `Assigned to ${app.officer}`, done: app.stage >= 2 },
                  { date: '2024-05-15T14:00:00', title: 'Compliance check', desc: 'AML and credit checks in progress', done: app.stage >= 3 },
                  { date: '2024-05-17T09:00:00', title: 'Manager approval', desc: 'Awaiting branch manager decision', done: app.stage >= 4 },
                  { date: '2024-05-19T16:00:00', title: 'Approved & disbursed', desc: 'Funds released to account', done: app.stage >= 5 },
                ].map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${event.done ? 'bg-success-500 text-white' : 'bg-ink-100 text-ink-400'}`}>
                        {event.done ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                      </div>
                      {i < 4 && <div className={`mt-1 h-full w-0.5 flex-1 ${event.done ? 'bg-success-200' : 'bg-ink-100'}`} />}
                    </div>
                    <div className="pb-2">
                      <div className={`text-sm font-semibold ${event.done ? 'text-navy-800' : 'text-ink-400'}`}>{event.title}</div>
                      <div className="text-xs text-ink-500">{event.desc}</div>
                      {event.done && <div className="mt-0.5 text-[11px] text-ink-400">{formatDateTime(event.date)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-ink-50 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm"><Icon className="h-4.5 w-4.5" /></div>
      <div><div className="text-xs text-ink-500">{label}</div><div className="text-sm font-semibold text-navy-800">{value}</div></div>
    </div>
  )
}
