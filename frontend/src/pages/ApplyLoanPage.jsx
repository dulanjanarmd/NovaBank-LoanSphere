import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CreditCard, Calculator, FileText, PenTool, Sparkles } from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import { loanProducts, branchList, formatLKR } from '../data/mockData'

const steps = [
  { id: 1, label: 'Loan Product', icon: Sparkles },
  { id: 2, label: 'Loan Details', icon: Calculator },
  { id: 3, label: 'Personal Info', icon: FileText },
  { id: 4, label: 'Review & e-Sign', icon: PenTool },
  { id: 5, label: 'Confirmation', icon: Check },
]

function calcEMI(principal, annualRate, tenureMonths) {
  const r = annualRate / 12 / 100
  if (r === 0) return principal / tenureMonths
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1)
}

export default function ApplyLoanPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    product: '', amount: 1000000, tenure: 60, branch: '',
    firstName: '', lastName: '', nic: '', mobile: '', email: '', income: '',
    purpose: '', agreed: false, signed: false,
  })

  const update = (k, v) => setData((d) => ({ ...d, [k]: v }))

  const selectedProduct = loanProducts.find((p) => p.id === data.product)
  const rate = selectedProduct?.rate || 0
  const emi = useMemo(() => calcEMI(Number(data.amount), rate, Number(data.tenure)), [data.amount, rate, data.tenure])
  const totalPayable = emi * Number(data.tenure)
  const totalInterest = totalPayable - Number(data.amount)

  const canNext = () => {
    if (step === 1) return data.product && data.branch
    if (step === 2) return data.amount && data.tenure && data.purpose
    if (step === 3) return data.firstName && data.lastName && data.nic && data.mobile && data.email && data.income
    if (step === 4) return data.agreed && data.signed
    return true
  }

  const next = () => setStep((s) => Math.min(s + 1, 5))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen bg-ink-50">
      <CustomerHeader active="Apply for Loan" />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link to="/portal/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-navy-800">Apply for a Loan</h1>
        <p className="text-sm text-ink-500">Get pre-qualified in minutes with our online wizard.</p>

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

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="card lg:col-span-2 p-6 sm:p-8">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-navy-800">Select a loan product</h2>
                <p className="text-sm text-ink-500">Choose the loan that suits your needs.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {loanProducts.map((p) => (
                    <button key={p.id} onClick={() => update('product', p.id)} className={`rounded-xl border-2 p-5 text-left transition-all ${data.product === p.id ? 'border-accent-500 bg-accent-50' : 'border-ink-100 hover:border-navy-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-700 text-white"><CreditCard className="h-4.5 w-4.5" /></div>
                          <div className="font-bold text-navy-800">{p.name}</div>
                        </div>
                        {data.product === p.id && <Check className="h-5 w-5 text-accent-600" />}
                      </div>
                      <div className="mt-2 text-xs text-ink-500">{p.purpose}</div>
                      <div className="mt-3 flex gap-3 text-xs">
                        <span className="chip bg-accent-50 text-accent-700">{p.rate}% p.a.</span>
                        <span className="chip bg-ink-100 text-ink-600">Up to {formatLKR(p.maxAmount)}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-5"><label className="label">Preferred branch</label><select className="input" value={data.branch} onChange={(e) => update('branch', e.target.value)}><option value="">Select a branch</option>{branchList.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}</select></div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold text-navy-800">Loan details</h2>
                <p className="text-sm text-ink-500">Tell us how much you need and for how long.</p>
                <div className="mt-5 space-y-5">
                  <div>
                    <div className="flex items-center justify-between"><label className="label">Loan amount</label><span className="text-xs font-semibold text-accent-600">{formatLKR(data.amount)}</span></div>
                    <input type="range" min={selectedProduct?.minAmount || 50000} max={selectedProduct?.maxAmount || 5000000} step="50000" className="w-full accent-accent-500" value={data.amount} onChange={(e) => update('amount', e.target.value)} />
                    <div className="flex justify-between text-[11px] text-ink-400"><span>{formatLKR(selectedProduct?.minAmount || 50000)}</span><span>{formatLKR(selectedProduct?.maxAmount || 5000000)}</span></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between"><label className="label">Tenure (months)</label><span className="text-xs font-semibold text-accent-600">{data.tenure} months</span></div>
                    <input type="range" min="6" max={selectedProduct?.maxTenure || 60} step="6" className="w-full accent-accent-500" value={data.tenure} onChange={(e) => update('tenure', e.target.value)} />
                    <div className="flex justify-between text-[11px] text-ink-400"><span>6 mo</span><span>{selectedProduct?.maxTenure || 60} mo</span></div>
                  </div>
                  <div><label className="label">Purpose of loan</label><textarea className="input" rows="2" value={data.purpose} onChange={(e) => update('purpose', e.target.value)} placeholder="e.g. Purchase of vehicle for personal use" /></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold text-navy-800">Personal & financial information</h2>
                <p className="text-sm text-ink-500">We use this to assess your eligibility.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className="label">First name</label><input className="input" value={data.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Kavindya" /></div>
                  <div><label className="label">Last name</label><input className="input" value={data.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Perera" /></div>
                  <div><label className="label">National ID (NIC)</label><input className="input" value={data.nic} onChange={(e) => update('nic', e.target.value)} placeholder="199512345678" /></div>
                  <div><label className="label">Mobile number</label><input className="input" value={data.mobile} onChange={(e) => update('mobile', e.target.value)} placeholder="+94 77 123 4567" /></div>
                  <div className="sm:col-span-2"><label className="label">Email address</label><input type="email" className="input" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.lk" /></div>
                  <div className="sm:col-span-2"><label className="label">Monthly income (Rs.)</label><input type="number" className="input" value={data.income} onChange={(e) => update('income', e.target.value)} placeholder="185000" /></div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-lg font-bold text-navy-800">Review and e-Sign</h2>
                <p className="text-sm text-ink-500">Confirm your loan terms and sign electronically.</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-ink-100 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[['Product', selectedProduct?.name], ['Amount', formatLKR(data.amount)], ['Tenure', `${data.tenure} months`], ['Interest rate', `${rate}% p.a.`], ['Monthly EMI', formatLKR(emi)], ['Total payable', formatLKR(totalPayable)]].map(([l, v]) => (
                        <div key={l} className="flex justify-between border-b border-ink-50 py-1.5"><span className="text-sm text-ink-500">{l}</span><span className="text-sm font-semibold text-navy-800">{v}</span></div>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-start gap-2.5 rounded-lg bg-ink-50 p-4 text-sm text-ink-600">
                    <input type="checkbox" className="mt-0.5 rounded border-ink-300" checked={data.agreed} onChange={(e) => update('agreed', e.target.checked)} />
                    <span>I have read and agree to the loan terms, interest rates, and NovaBank's lending policies. I authorize NovaBank to perform a credit check.</span>
                  </label>
                  <div className={`rounded-xl border-2 p-5 transition-all ${data.signed ? 'border-success-500 bg-success-50' : 'border-dashed border-ink-200 bg-ink-50'}`}>
                    <div className="mb-3 text-sm font-semibold text-navy-800">Electronic signature</div>
                    {data.signed ? (
                      <div className="flex items-center gap-2 text-success-700"><Check className="h-5 w-5" /> Signed as {data.firstName} {data.lastName}</div>
                    ) : (
                      <button onClick={() => update('signed', true)} className="btn-outline"><PenTool className="h-4 w-4" /> Click to sign electronically</button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600"><Check className="h-8 w-8" /></div>
                <h2 className="mt-4 text-2xl font-bold text-navy-800">Loan application submitted!</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">Your application is now under review. You'll receive updates at each stage via SMS and email.</p>
                <div className="mx-auto mt-6 max-w-sm rounded-xl bg-ink-50 p-4 text-left text-sm">
                  <div className="flex justify-between py-1"><span className="text-ink-500">Reference</span><span className="font-bold text-navy-800">LN-2024-{Math.floor(1000 + Math.random() * 9000)}</span></div>
                  <div className="flex justify-between py-1"><span className="text-ink-500">Product</span><span className="font-semibold text-ink-700">{selectedProduct?.name}</span></div>
                  <div className="flex justify-between py-1"><span className="text-ink-500">Amount</span><span className="font-semibold text-ink-700">{formatLKR(data.amount)}</span></div>
                  <div className="flex justify-between py-1"><span className="text-ink-500">Monthly EMI</span><span className="font-semibold text-ink-700">{formatLKR(emi)}</span></div>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                  <Link to="/portal/applications" className="btn-primary">Track Application</Link>
                  <Link to="/portal/dashboard" className="btn-outline">Go to Dashboard</Link>
                </div>
              </div>
            )}

            {step < 5 && (
              <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
                <button onClick={back} disabled={step === 1} className="btn-outline disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Back</button>
                {step === 4 ? (
                  <button onClick={next} disabled={!canNext()} className="btn-primary disabled:opacity-40">Submit Application <Check className="h-4 w-4" /></button>
                ) : (
                  <button onClick={next} disabled={!canNext()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">Continue <ArrowRight className="h-4 w-4" /></button>
                )}
              </div>
            )}
          </div>

          {/* Summary sidebar - visible from step 2 */}
          {step >= 2 && step < 5 && (
            <div className="lg:col-span-1">
              <div className="card sticky top-24 p-5">
                <div className="mb-4 flex items-center gap-2"><Calculator className="h-5 w-5 text-accent-600" /><h3 className="font-bold text-navy-800">Loan Summary</h3></div>
                <div className="rounded-xl bg-gradient-to-br from-navy-700 to-accent-600 p-5 text-white">
                  <div className="text-xs text-navy-100">Monthly EMI</div>
                  <div className="text-2xl font-bold">{formatLKR(emi)}</div>
                </div>
                <div className="mt-4 space-y-2.5 text-sm">
                  <Row label="Loan amount" value={formatLKR(data.amount)} />
                  <Row label="Interest rate" value={`${rate}% p.a.`} />
                  <Row label="Tenure" value={`${data.tenure} months`} />
                  <Row label="Total interest" value={formatLKR(totalInterest)} />
                  <div className="border-t border-ink-100 pt-2.5"><Row label="Total payable" value={formatLKR(totalPayable)} bold /></div>
                </div>
                <div className="mt-4 rounded-lg bg-ink-50 p-3 text-xs text-ink-500">EMI is indicative. Final rate depends on credit assessment.</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={bold ? 'font-bold text-navy-800' : 'font-semibold text-ink-700'}>{value}</span>
    </div>
  )
}
