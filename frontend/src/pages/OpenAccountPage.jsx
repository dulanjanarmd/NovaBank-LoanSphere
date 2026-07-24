import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, User, MapPin, FileCheck, Sparkles } from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import { accountTypes, branchList, formatLKR } from '../data/mockData'

const steps = [
  { id: 1, label: 'Account Type', icon: Sparkles },
  { id: 2, label: 'Personal Details', icon: User },
  { id: 3, label: 'Address & Employment', icon: MapPin },
  { id: 4, label: 'Review & Submit', icon: FileCheck },
  { id: 5, label: 'Confirmation', icon: Check },
]

export default function OpenAccountPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ accountType: '', branch: '', firstName: '', lastName: '', nic: '', dob: '', gender: '', mobile: '', email: '', address: '', city: '', district: '', employment: '', employer: '', monthlyIncome: '' })
  const update = (k, v) => setData((d) => ({ ...d, [k]: v }))
  const canNext = () => {
    if (step === 1) return data.accountType && data.branch
    if (step === 2) return data.firstName && data.lastName && data.nic && data.dob && data.mobile && data.email
    if (step === 3) return data.address && data.city && data.employment && data.monthlyIncome
    return true
  }

  const next = () => setStep((s) => Math.min(s + 1, 5))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const selectedAccount = accountTypes.find((a) => a.id === data.accountType)

  return (
    <div className="min-h-screen bg-ink-50">
      <CustomerHeader />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link to="/portal/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-navy-800">Open a New Account</h1>
        <p className="text-sm text-ink-500">Complete the steps below to open your account online.</p>

        {/* Stepper */}
        <div className="card mt-6 p-6">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon
              const isComplete = step > s.id
              const isCurrent = step === s.id
              const isLast = idx === steps.length - 1
              return (
                <div key={s.id} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${isComplete ? 'border-success-500 bg-success-500 text-white' : isCurrent ? 'border-accent-500 bg-accent-50 text-accent-700 ring-4 ring-accent-100' : 'border-ink-200 bg-white text-ink-400'}`}>
                      {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-4.5 w-4.5" />}
                    </div>
                    <div className={`text-[11px] font-semibold ${isCurrent || isComplete ? 'text-navy-800' : 'text-ink-400'}`}>{s.label}</div>
                  </div>
                  {!isLast && <div className={`mx-2 h-0.5 flex-1 rounded-full ${isComplete ? 'bg-success-500' : 'bg-ink-200'}`} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="card mt-6 p-6 sm:p-8">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-navy-800">Choose your account type</h2>
              <p className="text-sm text-ink-500">Select the account that fits your needs.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {accountTypes.map((a) => (
                  <button key={a.id} onClick={() => update('accountType', a.id)} className={`rounded-xl border-2 p-5 text-left transition-all ${data.accountType === a.id ? 'border-accent-500 bg-accent-50' : 'border-ink-100 hover:border-navy-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-navy-800">{a.name}</div>
                      {data.accountType === a.id && <Check className="h-5 w-5 text-accent-600" />}
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-ink-500">
                      <div>Min deposit: <span className="font-semibold text-ink-700">{formatLKR(a.minDeposit)}</span></div>
                      <div>Interest: <span className="font-semibold text-ink-700">{a.rate}</span></div>
                      <div>Monthly fee: <span className="font-semibold text-ink-700">{a.fee}</span></div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <label className="label">Preferred branch</label>
                <select className="input" value={data.branch} onChange={(e) => update('branch', e.target.value)}>
                  <option value="">Select a branch</option>
                  {branchList.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-navy-800">Personal details</h2>
              <p className="text-sm text-ink-500">Tell us about yourself.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><label className="label">First name</label><input className="input" value={data.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Kavindya" /></div>
                <div><label className="label">Last name</label><input className="input" value={data.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Perera" /></div>
                <div><label className="label">National ID (NIC)</label><input className="input" value={data.nic} onChange={(e) => update('nic', e.target.value)} placeholder="199512345678" /></div>
                <div><label className="label">Date of birth</label><input type="date" className="input" value={data.dob} onChange={(e) => update('dob', e.target.value)} /></div>
                <div><label className="label">Gender</label><select className="input" value={data.gender} onChange={(e) => update('gender', e.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></div>
                <div><label className="label">Mobile number</label><input className="input" value={data.mobile} onChange={(e) => update('mobile', e.target.value)} placeholder="+94 77 123 4567" /></div>
                <div className="sm:col-span-2"><label className="label">Email address</label><input type="email" className="input" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.lk" /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-navy-800">Address & employment</h2>
              <p className="text-sm text-ink-500">Where do you live and work?</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="label">Residential address</label><textarea className="input" rows="2" value={data.address} onChange={(e) => update('address', e.target.value)} placeholder="No. 45, Galle Road, Colombo 03" /></div>
                <div><label className="label">City</label><input className="input" value={data.city} onChange={(e) => update('city', e.target.value)} placeholder="Colombo" /></div>
                <div><label className="label">District</label><select className="input" value={data.district} onChange={(e) => update('district', e.target.value)}><option value="">Select</option>{['Colombo','Gampaha','Kalutara','Kandy','Galle','Matara','Jaffna','Kurunegala'].map((d) => <option key={d}>{d}</option>)}</select></div>
                <div><label className="label">Employment type</label><select className="input" value={data.employment} onChange={(e) => update('employment', e.target.value)}><option value="">Select</option><option>Employed (Private)</option><option>Employed (Government)</option><option>Self-employed</option><option>Business Owner</option><option>Retired</option></select></div>
                <div><label className="label">Employer / Business</label><input className="input" value={data.employer} onChange={(e) => update('employer', e.target.value)} placeholder="John Keells Holdings" /></div>
                <div className="sm:col-span-2"><label className="label">Monthly income (Rs.)</label><input type="number" className="input" value={data.monthlyIncome} onChange={(e) => update('monthlyIncome', e.target.value)} placeholder="185000" /></div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-navy-800">Review your application</h2>
              <p className="text-sm text-ink-500">Please confirm the details below before submitting.</p>
              <div className="mt-5 space-y-4">
                <ReviewSection title="Account" items={[['Type', selectedAccount?.name], ['Branch', branchList.find((b) => b.code === data.branch)?.name], ['Min deposit', selectedAccount && formatLKR(selectedAccount.minDeposit)]]} />
                <ReviewSection title="Personal" items={[['Name', `${data.firstName} ${data.lastName}`], ['NIC', data.nic], ['DOB', data.dob], ['Mobile', data.mobile], ['Email', data.email]]} />
                <ReviewSection title="Address & Employment" items={[['Address', `${data.address}, ${data.city}`], ['Employment', data.employment], ['Employer', data.employer], ['Income', data.monthlyIncome && formatLKR(data.monthlyIncome)]]} />
                <label className="flex items-start gap-2.5 rounded-lg bg-ink-50 p-4 text-sm text-ink-600">
                  <input type="checkbox" className="mt-0.5 rounded border-ink-300" defaultChecked />
                  <span>I confirm the information provided is accurate and I agree to NovaBank's terms, conditions and privacy policy.</span>
                </label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600"><Check className="h-8 w-8" /></div>
              <h2 className="mt-4 text-2xl font-bold text-navy-800">Application submitted!</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">Your account opening request has been received. We'll process it within 2 business days and notify you by SMS and email.</p>
              <div className="mx-auto mt-6 max-w-sm rounded-xl bg-ink-50 p-4 text-left text-sm">
                <div className="flex justify-between py-1"><span className="text-ink-500">Reference</span><span className="font-bold text-navy-800">ACC-2024-0457</span></div>
                <div className="flex justify-between py-1"><span className="text-ink-500">Account type</span><span className="font-semibold text-ink-700">{selectedAccount?.name}</span></div>
                <div className="flex justify-between py-1"><span className="text-ink-500">Branch</span><span className="font-semibold text-ink-700">{branchList.find((b) => b.code === data.branch)?.name}</span></div>
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/portal/dashboard" className="btn-primary">Go to Dashboard</Link>
                <button onClick={() => { setStep(1); setData({}) }} className="btn-outline">Open Another</button>
              </div>
            </div>
          )}

          {step < 5 && (
            <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
              <button onClick={back} disabled={step === 1} className="btn-outline disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Back</button>
              {step === 4 ? (
                <button onClick={next} className="btn-primary">Submit Application <Check className="h-4 w-4" /></button>
              ) : (
                <button onClick={next} disabled={!canNext()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">Continue <ArrowRight className="h-4 w-4" /></button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ReviewSection({ title, items }) {
  return (
    <div className="rounded-xl border border-ink-100 p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}><div className="text-xs text-ink-400">{label}</div><div className="text-sm font-semibold text-navy-800">{value || '—'}</div></div>
        ))}
      </div>
    </div>
  )
}
