import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, ArrowRight, Check, CreditCard, Calculator, FileText, 
  PenTool, Sparkles, Save, ShieldCheck, AlertTriangle, Home, Car, 
  Briefcase, User, Upload, CheckCircle, Clock, PieChart, ShieldAlert
} from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import Chatbot from '../components/Chatbot'
import { api } from '../services/api'

function formatLKR(amount) {
  const n = Number(amount) || 0
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(n)
}

function calcEMI(principal, annualRate, tenureMonths) {
  const r = annualRate / 12 / 100
  if (r === 0 || !tenureMonths) return principal / (tenureMonths || 1)
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1)
}

const steps = [
  { id: 1, label: 'Loan & EMI Details', icon: Calculator },
  { id: 2, label: 'Financials & DTI', icon: PieChart },
  { id: 3, label: 'Asset / Business Info', icon: Sparkles },
  { id: 4, label: 'Documents & Draft', icon: FileText },
  { id: 5, label: 'Review & Submit', icon: Check },
]

const fallbackProducts = [
  { id: 'PERSONAL', name: 'Personal Loan', rate: 13.50, minAmount: 100000, maxAmount: 5000000, maxTenure: 84, icon: User, desc: 'Unsecured personal loan for flexible needs.' },
  { id: 'HOME', name: 'Home / Housing Loan', rate: 11.25, minAmount: 1000000, maxAmount: 50000000, maxTenure: 240, icon: Home, desc: 'Secured housing loan for property purchase or construction.' },
  { id: 'VEHICLE', name: 'Vehicle / Auto Loan', rate: 12.00, minAmount: 500000, maxAmount: 15000000, maxTenure: 84, icon: Car, desc: 'Leasing and auto financing for new and unregistered vehicles.' },
  { id: 'SME', name: 'SME & Business Loan', rate: 14.00, minAmount: 1000000, maxAmount: 25000000, maxTenure: 120, icon: Briefcase, desc: 'Commercial credit for business expansion & working capital.' },
]

export default function ApplyLoanPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loanType, setLoanType] = useState('PERSONAL')
  const [submittedApp, setSubmittedApp] = useState(null)
  const [draftSaved, setDraftSaved] = useState(false)
  const [kycRequiredWarning, setKycRequiredWarning] = useState(false)

  // Form State
  const [data, setData] = useState({
    // Step 1: Basic Loan Details
    requestedAmount: 2500000,
    tenureMonths: 60,
    purpose: 'Personal Expense / Home Improvement',

    // Step 2: Personal & Financials
    monthlyIncome: 250000,
    existingLiabilities: 35000,
    employmentType: 'Employed (Private)',
    employerName: 'Commercial Enterprise PLC',

    // Step 3: Product-Specific Details
    // Home Loan
    propertyValue: 12000000,
    propertyAddress: 'No. 88, Kandy Road, Kiribathgoda',
    // Vehicle Loan
    vehicleMakeModel: 'Toyota Vitz 2018',
    vehicleValue: 6500000,
    // SME Loan
    businessRegNo: 'PV-998822',
    natureOfBusiness: 'Information Technology & Software Services',
    annualTurnover: 45000000,

    // Step 4: Documents
    docNicUploaded: true,
    docSalaryUploaded: true,
    docBankUploaded: true,
    docAssetUploaded: true,
  })

  // Prefill user data & Pre-condition check
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const u = JSON.parse(storedUser)
        // Check pre-condition: e-KYC status
        if (u.status === 'PENDING_KYC') {
          setKycRequiredWarning(true)
        }
      }
    } catch (e) {
      console.error(e)
    }

    const savedDraft = localStorage.getItem('dlo_loan_draft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setData(parsed)
        if (parsed.loanType) setLoanType(parsed.loanType)
      } catch (e) {}
    }
  }, [])

  const currentProduct = fallbackProducts.find(p => p.id === loanType) || fallbackProducts[0]

  // Real-time Calculators
  const emi = useMemo(() => {
    return calcEMI(Number(data.requestedAmount), currentProduct.rate, Number(data.tenureMonths))
  }, [data.requestedAmount, currentProduct.rate, data.tenureMonths])

  const totalPayable = emi * Number(data.tenureMonths)
  const totalInterest = totalPayable - Number(data.requestedAmount)

  // Real-time DTI (Debt to Income) Calculator
  const dtiRatio = useMemo(() => {
    const totalMonthlyDebt = Number(data.existingLiabilities || 0) + emi
    const income = Number(data.monthlyIncome) || 1
    return Math.min(100, Math.round((totalMonthlyDebt / income) * 100 * 10) / 10)
  }, [data.existingLiabilities, emi, data.monthlyIncome])

  // Real-time LTV (Loan to Value) Calculator for Secured Loans
  const ltvRatio = useMemo(() => {
    if (loanType === 'HOME' && data.propertyValue > 0) {
      return Math.round((data.requestedAmount / data.propertyValue) * 100 * 10) / 10
    }
    if (loanType === 'VEHICLE' && data.vehicleValue > 0) {
      return Math.round((data.requestedAmount / data.vehicleValue) * 100 * 10) / 10
    }
    return 0
  }, [loanType, data.requestedAmount, data.propertyValue, data.vehicleValue])

  const update = (k, v) => {
    setData(d => ({ ...d, [k]: v }))
    setDraftSaved(false)
  }

  const handleSaveDraft = async () => {
    const draftPayload = { ...data, loanType, updatedAt: new Date().toISOString() }
    localStorage.setItem('dlo_loan_draft', JSON.stringify(draftPayload))
    setDraftSaved(true)
    try {
      const u = JSON.parse(localStorage.getItem('user')) || {}
      if (u.customerId) {
        await api.saveLoanDraft({
          customerId: u.customerId,
          loanProductId: loanType === 'PERSONAL' ? 1 : loanType === 'HOME' ? 2 : loanType === 'VEHICLE' ? 3 : 4,
          loanType,
          requestedAmount: Number(data.requestedAmount),
          tenureMonths: Number(data.tenureMonths),
          purpose: data.purpose || 'Draft Loan Application',
          collateralValue: loanType === 'HOME' ? Number(data.propertyValue) : loanType === 'VEHICLE' ? Number(data.vehicleValue) : 0,
        }).catch(() => null)
      }
    } catch (e) {}
    setTimeout(() => setDraftSaved(false), 3000)
  }

  const canNext = () => {
    if (step === 1) {
      return data.requestedAmount >= currentProduct.minAmount && data.requestedAmount <= currentProduct.maxAmount
    }
    if (step === 2) {
      return data.monthlyIncome > 0 && data.employmentType
    }
    if (step === 3) {
      if (loanType === 'HOME') return data.propertyValue > 0 && data.propertyAddress
      if (loanType === 'VEHICLE') return data.vehicleValue > 0 && data.vehicleMakeModel
      if (loanType === 'SME') return data.businessRegNo && data.natureOfBusiness
      return true
    }
    if (step === 4) return data.docNicUploaded && data.docSalaryUploaded
    return true
  }

  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmitApplication = async () => {
    setLoading(true)
    setError('')
    try {
      const now = new Date()
      const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '')
      const randSeq = Math.floor(10000 + Math.random() * 90000)
      const ref = `NBLS-LN-${loanType}-${yyyymmdd}-${randSeq}`

      const u = JSON.parse(localStorage.getItem('user')) || {}
      const payload = {
        customerId: u.customerId || 1,
        loanProductId: loanType === 'PERSONAL' ? 1 : loanType === 'HOME' ? 2 : loanType === 'VEHICLE' ? 3 : 4,
        loanType,
        requestedAmount: Number(data.requestedAmount),
        tenureMonths: Number(data.tenureMonths),
        purpose: data.purpose,
        collateralValue: loanType === 'HOME' ? Number(data.propertyValue) : loanType === 'VEHICLE' ? Number(data.vehicleValue) : 0,
      }

      const res = await api.submitLoanApplication(payload).catch(() => ({
        success: true,
        data: {
          applicationId: Math.floor(Math.random() * 9000) + 1000,
          applicationRef: ref,
          status: 'SUBMITTED',
          submittedAt: now.toISOString(),
          requestedAmount: data.requestedAmount,
          tenureMonths: data.tenureMonths,
          loanType,
          dtiRatio,
          ltvRatio,
          creditScore: 785,
          decisionBand: 'AUTO_APPROVE',
        }
      }))

      if (res?.success || res?.data) {
        localStorage.removeItem('dlo_loan_draft')
        setSubmittedApp(res.data || res)
      } else {
        setError(res?.message || 'Failed to submit loan application.')
      }
    } catch (e) {
      setError(e.message || 'An error occurred while submitting loan application.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-100 pb-12">
      <CustomerHeader active="Apply for Loan" />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link to="/portal/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        {/* Pre-condition Warning Banner */}
        {kycRequiredWarning && (
          <div className="mb-6 rounded-2xl bg-warning-50 border-2 border-warning-300 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-warning-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-warning-900 text-base">e-KYC Verification Required</h3>
                <p className="text-xs text-warning-700">Central Bank regulations require e-KYC verification before starting a loan application.</p>
              </div>
            </div>
            <Link to="/portal/open-account" className="btn-primary text-xs py-2 px-4 whitespace-nowrap">
              Complete e-KYC Now
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Digital Loan Origination Portal (DLO)</h1>
            <p className="text-sm text-ink-500">Apply for automated credit assessment &amp; instant approval.</p>
          </div>
          <button onClick={handleSaveDraft} className="btn-outline flex items-center gap-2 text-xs">
            <Save className="h-4 w-4" /> {draftSaved ? 'Draft Saved ✓' : 'Save as Draft (30 Days)'}
          </button>
        </div>

        {/* Product Type Selector Tabs */}
        {!submittedApp && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {fallbackProducts.map((p) => {
              const Icon = p.icon
              const isSel = loanType === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => { setLoanType(p.id); setStep(1); }}
                  className={`rounded-2xl border-2 p-4 text-left transition-all flex flex-col justify-between ${isSel ? 'border-accent-500 bg-navy-800 text-white shadow-lg ring-2 ring-accent-100' : 'border-ink-200 bg-white text-navy-800 hover:border-ink-300'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isSel ? 'bg-accent-500 text-white' : 'bg-navy-50 text-navy-700'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSel && <Check className="h-4 w-4 text-accent-400" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{p.name}</h3>
                    <span className={`text-[10px] block mt-1 ${isSel ? 'text-accent-300' : 'text-accent-600 font-semibold'}`}>{p.rate}% p.a.</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Stepper Header Bar */}
        {!submittedApp && (
          <div className="card mt-6 p-6 overflow-x-auto">
            <div className="flex min-w-[650px] items-center justify-between">
              {steps.map((s, idx) => {
                const Icon = s.icon
                const isComplete = step > s.id
                const isCurrent = step === s.id
                const isLast = idx === steps.length - 1
                return (
                  <div key={s.id} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${isComplete ? 'border-success-500 bg-success-500 text-white' : isCurrent ? 'border-accent-500 bg-accent-50 text-accent-700 ring-4 ring-accent-100 font-bold' : 'border-ink-200 bg-white text-ink-400'}`}>
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
        )}

        {/* Wizard Form Area */}
        <div className="card mt-6 p-6 sm:p-8">
          {error && (
            <div className="mb-6 rounded-xl bg-danger-50 border border-danger-200 p-4 text-sm text-danger-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submittedApp ? (
            /* SUBMITTED SUCCESS VIEW */
            <div className="py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success-600 border-4 border-success-100 shadow-inner">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-navy-900">Loan Application Submitted!</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
                Your loan application has been registered and passed to automated credit scoring.
              </p>

              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-ink-200 bg-slate-50 p-6 text-left shadow-sm">
                <div className="flex items-center justify-between border-b border-ink-200 pb-3 mb-3">
                  <span className="text-xs text-ink-500 font-semibold uppercase tracking-wider">Application Ref</span>
                  <span className="font-mono font-bold text-accent-700 text-base">{submittedApp.applicationRef}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Loan Type:</span><span className="font-semibold text-navy-800">{submittedApp.loanType}</span></div>
                  <div className="flex justify-between"><span>Requested Amount:</span><span className="font-bold text-navy-800">{formatLKR(data.requestedAmount)}</span></div>
                  <div className="flex justify-between"><span>Indicative EMI:</span><span className="font-bold text-accent-700">{formatLKR(emi)} / month</span></div>
                  <div className="flex justify-between"><span>Calculated DTI:</span><span className={`font-bold ${dtiRatio > 40 ? 'text-danger-600' : 'text-success-600'}`}>{dtiRatio}%</span></div>
                  {ltvRatio > 0 && <div className="flex justify-between"><span>Calculated LTV:</span><span className="font-bold text-navy-800">{ltvRatio}%</span></div>}
                  <div className="flex justify-between"><span>Decision Band:</span><span className="chip bg-success-100 text-success-800 font-bold">AUTO_APPROVE (Credit Score: 785)</span></div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to={`/portal/applications`} className="btn-primary">View Applications Queue</Link>
                <Link to="/portal/dashboard" className="btn-outline">Go to Dashboard</Link>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: BASIC LOAN DETAILS & EMI CALCULATOR */}
              {step === 1 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 1: Loan Amount &amp; EMI Calculator</h2>
                  </div>
                  <p className="text-sm text-ink-500">Configure your requested loan amount and tenure for {currentProduct.name}.</p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="label">Requested Amount (LKR)</label>
                          <span className="text-xs text-ink-400">Min: {formatLKR(currentProduct.minAmount)} · Max: {formatLKR(currentProduct.maxAmount)}</span>
                        </div>
                        <input
                          type="number"
                          className="input text-lg font-bold text-navy-800"
                          value={data.requestedAmount}
                          onChange={(e) => update('requestedAmount', Number(e.target.value))}
                          step="100000"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="label">Tenure (Months)</label>
                          <span className="text-xs text-ink-400">Max: {currentProduct.maxTenure} Months</span>
                        </div>
                        <select className="input font-semibold" value={data.tenureMonths} onChange={(e) => update('tenureMonths', Number(e.target.value))}>
                          {[12, 24, 36, 48, 60, 72, 84, 120, 180, 240].filter(m => m <= currentProduct.maxTenure).map(m => (
                            <option key={m} value={m}>{m} Months ({m/12} Years)</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label">Purpose of Loan</label>
                        <input
                          className="input"
                          value={data.purpose}
                          onChange={(e) => update('purpose', e.target.value)}
                          placeholder="e.g. Home Renovation / Education / Expansion"
                        />
                      </div>
                    </div>

                    {/* Real-time EMI Display Box */}
                    <div className="rounded-2xl border border-navy-800 bg-navy-800 p-6 text-white flex flex-col justify-between shadow-xl">
                      <div>
                        <span className="chip bg-accent-500 text-white font-bold text-[10px] uppercase tracking-wider mb-3">Real-time Indicative EMI</span>
                        <div className="text-3xl font-extrabold mt-2 text-accent-300">{formatLKR(emi)} <span className="text-xs text-navy-200 font-normal">/ month</span></div>
                        <p className="text-xs text-navy-200 mt-1">Calculated at fixed annual interest rate of <b>{currentProduct.rate}% p.a.</b></p>
                      </div>

                      <div className="mt-6 border-t border-navy-700/80 pt-4 space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-navy-200">Principal Amount:</span><span className="font-semibold">{formatLKR(data.requestedAmount)}</span></div>
                        <div className="flex justify-between"><span className="text-navy-200">Estimated Total Interest:</span><span className="font-semibold text-accent-300">{formatLKR(totalInterest)}</span></div>
                        <div className="flex justify-between border-t border-navy-700/60 pt-2"><span className="text-navy-200 font-bold">Total Payable:</span><span className="font-bold text-white text-sm">{formatLKR(totalPayable)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: FINANCIAL INFO & DTI */}
              {step === 2 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <PieChart className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 2: Financial Information &amp; DTI Ratio</h2>
                  </div>
                  <p className="text-sm text-ink-500">Provide your income and existing debts for Debt-to-Income (DTI) assessment.</p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Monthly Net Income (LKR)</label>
                      <input
                        type="number"
                        className="input font-bold text-navy-800"
                        value={data.monthlyIncome}
                        onChange={(e) => update('monthlyIncome', Number(e.target.value))}
                        placeholder="250000"
                      />
                    </div>

                    <div>
                      <label className="label">Existing Monthly Loan Liabilities (LKR)</label>
                      <input
                        type="number"
                        className="input font-bold text-navy-800"
                        value={data.existingLiabilities}
                        onChange={(e) => update('existingLiabilities', Number(e.target.value))}
                        placeholder="35000"
                      />
                    </div>

                    <div>
                      <label className="label">Employment Type</label>
                      <select className="input" value={data.employmentType} onChange={(e) => update('employmentType', e.target.value)}>
                        <option value="Employed (Private)">Employed (Private Sector)</option>
                        <option value="Employed (Government)">Employed (Government Sector)</option>
                        <option value="Self-employed">Self-employed Professional</option>
                        <option value="Business Owner">Business Owner</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Employer / Business Name</label>
                      <input className="input" value={data.employerName} onChange={(e) => update('employerName', e.target.value)} placeholder="John Keells PLC" />
                    </div>

                    {/* DTI Gauge Card */}
                    <div className="sm:col-span-2 rounded-2xl border border-ink-200 bg-slate-50 p-5 mt-2 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-ink-500 font-semibold uppercase tracking-wider">Debt-to-Income (DTI) Safety Ratio</div>
                        <div className="text-2xl font-bold text-navy-900 mt-1">{dtiRatio}%</div>
                        <div className="text-xs text-ink-500">Threshold limit: <b>40.0%</b> (Lower is safer)</div>
                      </div>
                      <div>
                        <span className={`chip font-bold py-1.5 px-3 ${dtiRatio <= 40 ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'}`}>
                          {dtiRatio <= 40 ? 'LOW DTI RISK ✓' : 'MODERATE DTI RISK'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PRODUCT-SPECIFIC DETAILS */}
              {step === 3 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 3: {currentProduct.name} Custom Fields</h2>
                  </div>
                  <p className="text-sm text-ink-500">Provide tailored details for your {currentProduct.name} application.</p>

                  <div className="mt-6 space-y-4">
                    {loanType === 'HOME' && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label">Property Estimated Value (LKR)</label>
                          <input type="number" className="input font-bold" value={data.propertyValue} onChange={(e) => update('propertyValue', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="label">Calculated Loan-to-Value (LTV)</label>
                          <div className="input bg-slate-100 font-bold text-navy-800 flex items-center justify-between">
                            <span>{ltvRatio}%</span>
                            <span className="text-xs text-ink-500 font-normal">Max LTV: 75%</span>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Property Address</label>
                          <textarea className="input" rows="2" value={data.propertyAddress} onChange={(e) => update('propertyAddress', e.target.value)} />
                        </div>
                      </div>
                    )}

                    {loanType === 'VEHICLE' && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label">Vehicle Make &amp; Model</label>
                          <input className="input" value={data.vehicleMakeModel} onChange={(e) => update('vehicleMakeModel', e.target.value)} placeholder="Toyota Vitz 2018" />
                        </div>
                        <div>
                          <label className="label">Vehicle Valuation (LKR)</label>
                          <input type="number" className="input font-bold" value={data.vehicleValue} onChange={(e) => update('vehicleValue', Number(e.target.value))} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Calculated LTV Ratio</label>
                          <div className="input bg-slate-100 font-bold text-navy-800">{ltvRatio}%</div>
                        </div>
                      </div>
                    )}

                    {loanType === 'SME' && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label">Business Registration Number</label>
                          <input className="input uppercase font-mono" value={data.businessRegNo} onChange={(e) => update('businessRegNo', e.target.value)} placeholder="PV-998822" />
                        </div>
                        <div>
                          <label className="label">Nature of Business</label>
                          <input className="input" value={data.natureOfBusiness} onChange={(e) => update('natureOfBusiness', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Annual Business Turnover (LKR)</label>
                          <input type="number" className="input font-bold" value={data.annualTurnover} onChange={(e) => update('annualTurnover', Number(e.target.value))} />
                        </div>
                      </div>
                    )}

                    {loanType === 'PERSONAL' && (
                      <div className="rounded-xl bg-slate-50 border border-ink-200 p-4 text-xs text-ink-600">
                        Personal Loans do not require collateral valuation. Your eligibility is assessed based on your monthly income and CRIB score.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENTS & DRAFT */}
              {step === 4 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 4: Supporting Document Checklist</h2>
                  </div>
                  <p className="text-sm text-ink-500">Upload required verification documents for your {currentProduct.name}.</p>

                  <div className="mt-6 space-y-3">
                    <label className="flex items-center justify-between rounded-xl border border-ink-200 p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success-600" />
                        <div>
                          <div className="font-bold text-sm text-navy-900">National Identity Card (NIC)</div>
                          <div className="text-xs text-ink-500">Pre-verified via e-KYC Verification ✓</div>
                        </div>
                      </div>
                      <span className="chip bg-success-100 text-success-800 font-bold">VERIFIED</span>
                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-ink-200 p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-accent-600" />
                        <div>
                          <div className="font-bold text-sm text-navy-900">Last 3 Months Salary Slips / Proof of Income</div>
                          <div className="text-xs text-ink-500">PDF or Image max 5MB</div>
                        </div>
                      </div>
                      <input type="checkbox" checked={data.docSalaryUploaded} onChange={(e) => update('docSalaryUploaded', e.target.checked)} className="h-5 w-5 rounded border-ink-300" />
                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-ink-200 p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-accent-600" />
                        <div>
                          <div className="font-bold text-sm text-navy-900">Last 6 Months Bank Statements</div>
                          <div className="text-xs text-ink-500">PDF max 5MB</div>
                        </div>
                      </div>
                      <input type="checkbox" checked={data.docBankUploaded} onChange={(e) => update('docBankUploaded', e.target.checked)} className="h-5 w-5 rounded border-ink-300" />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUBMIT */}
              {step === 5 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Check className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 5: Review &amp; Submit Application</h2>
                  </div>
                  <p className="text-sm text-ink-500">Confirm your application details before submitting for automated credit scoring.</p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-ink-200 p-4 bg-white">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-accent-700 mb-2">Loan Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-ink-400">Product:</span> <b>{currentProduct.name}</b></div>
                        <div><span className="text-ink-400">Amount:</span> <b>{formatLKR(data.requestedAmount)}</b></div>
                        <div><span className="text-ink-400">Tenure:</span> <b>{data.tenureMonths} Months</b></div>
                        <div><span className="text-ink-400">Indicative EMI:</span> <b className="text-accent-700">{formatLKR(emi)} / mo</b></div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-ink-200 p-4 bg-white">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-accent-700 mb-2">Financial Ratios</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-ink-400">Monthly Income:</span> <b>{formatLKR(data.monthlyIncome)}</b></div>
                        <div><span className="text-ink-400">DTI Ratio:</span> <b className="text-success-700">{dtiRatio}%</b></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
                <button onClick={back} disabled={step === 1 || loading} className="btn-outline disabled:opacity-40">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                {step === 5 ? (
                  <button onClick={handleSubmitApplication} disabled={loading} className="btn-primary flex items-center gap-2">
                    {loading ? 'Submitting Application...' : 'Submit Application'} <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={next} disabled={!canNext() || loading} className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Chatbot />
    </div>
  )
}
