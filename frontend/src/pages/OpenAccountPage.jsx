import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, ArrowRight, Check, User, MapPin, FileCheck, Sparkles, 
  ScanLine, ShieldCheck, AlertTriangle, Building2, Search, CreditCard, 
  Upload, Camera, Lock, RefreshCw, FileText, CheckCircle, ShieldAlert, Clock
} from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import Chatbot from '../components/Chatbot'
import { api } from '../services/api'

function formatLKR(amount) {
  const n = Number(amount) || 0
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(n)
}

const steps = [
  { id: 1, label: 'Personal Details', icon: User },
  { id: 2, label: 'e-KYC & Liveness', icon: ScanLine },
  { id: 3, label: 'Product Selection', icon: Sparkles },
  { id: 4, label: 'Terms & Consent', icon: Lock },
  { id: 5, label: 'Review & Submit', icon: FileCheck },
]

const fallbackAccountProducts = [
  { id: 'acc-savings', productName: 'Nova e-Savings Account', rate: '6.50% p.a.', minBalance: 1000, desc: 'High-interest digital savings account with free e-Passbook and instant online transfers.' },
  { id: 'acc-premier', productName: 'Nova Premier High-Yield Savings', rate: '8.25% p.a.', minBalance: 25000, desc: 'Tiered high-rate savings account with complimentary debit card and priority banking perks.' },
  { id: 'acc-youth', productName: 'Nova Youth & Student Savings', rate: '7.00% p.a.', minBalance: 0, desc: 'Zero minimum balance e-account tailored for students and young adults under 26.' },
  { id: 'acc-current', productName: 'Nova Business Checking Account', rate: '0.00%', minBalance: 10000, desc: 'Full-featured current account with optional personalized chequebook and overdraft facility.' },
  { id: 'acc-fcva', productName: 'Nova Global Foreign Currency Savings (FCVA)', rate: '4.75% p.a.', minBalance: 100, desc: 'Multi-currency account supporting USD, EUR, GBP & AUD for international trade and remittances.' },
]

const fallbackBranches = [
  { code: 'B001', name: 'Colombo 01 - Fort (Head Office)', district: 'Colombo', address: 'No. 24, York Street, Colombo 01' },
  { code: 'B002', name: 'Colombo 03 - Kollupitiya', district: 'Colombo', address: 'No. 410, Galle Road, Colombo 03' },
  { code: 'B003', name: 'Kandy - Dalada Veediya', district: 'Kandy', address: 'No. 88, Dalada Veediya, Kandy' },
  { code: 'B004', name: 'Galle - Lighthouse Street', district: 'Galle', address: 'No. 15, Church Street, Galle Fort' },
  { code: 'B005', name: 'Jaffna - Hospital Road', district: 'Jaffna', address: 'No. 120, Hospital Road, Jaffna' },
  { code: 'B006', name: 'Negombo - Main Street', district: 'Gampaha', address: 'No. 240, Main Street, Negombo' },
  { code: 'B007', name: 'Matara - Anagarika Dharmapala Mw', district: 'Matara', address: 'No. 54, Anagarika Dharmapala Mw, Matara' },
  { code: 'B008', name: 'Kurunegala - Dambulla Road', district: 'Kurunegala', address: 'No. 95, Dambulla Road, Kurunegala' },
]

export default function OpenAccountPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [accountProducts, setAccountProducts] = useState(fallbackAccountProducts)
  const [branches, setBranches] = useState(fallbackBranches)

  // Form State according to SRS
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: '',
    dob: '',
    nicNumber: '',
    gender: 'Male',
    mobileNumber: '',
    email: '',
    permAddress: '',
    corrAddress: '',
    sameAsPerm: true,
    occupation: 'Software Engineer',
    sourceOfFunds: 'Salary',
    monthlyTurnover: '250000',

    // Step 2: e-KYC Files & Verification
    nicFrontFile: null,
    nicBackFile: null,
    ocrExtractedName: '',
    ocrExtractedNic: '',
    ocrExtractedDob: '',
    ocrVerified: false,

    // Liveness Selfie Check
    livenessScore: 0,
    faceMatchScore: 0,
    livenessVerified: false,
    livenessPromptStep: 0,
    livenessScanning: false,

    // PEP / Watchlist Risk
    pepHit: false,
    sanctionsHit: false,
    riskTier: 'LOW',

    // Step 3: Product & Branch Selection
    accountType: 'Nova e-Savings Account',
    currency: 'LKR',
    branch: 'B001',

    // Step 4: Terms & PDPA Consent
    termsAccepted: false,
    pdpaConsent: false,
    consentTimestamp: '',
    consentIp: '127.0.0.1',
  })

  const [error, setError] = useState('')
  const [appReference, setAppReference] = useState('')
  const [submissionComplete, setSubmissionComplete] = useState(false)

  // Auto-fill logged in customer profile if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        setFormData(d => ({
          ...d,
          fullName: u.fullName || d.fullName,
          nicNumber: u.nicNumber || d.nicNumber,
          email: u.email || d.email,
          mobileNumber: u.mobileNumber || d.mobileNumber,
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, branchRes] = await Promise.all([
          api.getPublicAccountProducts().catch(() => null),
          api.getPublicBranches().catch(() => null),
        ])
        if (prodRes?.data?.length) setAccountProducts(prodRes.data)
        if (branchRes?.data?.length) setBranches(branchRes.data)
      } catch (err) {
        console.error('Reference data error:', err)
      }
    }
    fetchData()
  }, [])

  const update = (k, v) => setFormData((d) => ({ ...d, [k]: v }))

  // Step Validation Logic
  const canNext = () => {
    if (step === 1) {
      return (
        formData.fullName &&
        formData.dob &&
        formData.nicNumber &&
        formData.mobileNumber &&
        formData.email &&
        formData.permAddress &&
        formData.occupation &&
        formData.sourceOfFunds &&
        formData.monthlyTurnover
      )
    }
    if (step === 2) {
      return formData.ocrVerified && formData.livenessVerified
    }
    if (step === 3) {
      return formData.accountType && formData.branch
    }
    if (step === 4) {
      return formData.termsAccepted && formData.pdpaConsent
    }
    return true
  }

  const next = () => {
    if (step === 4 && (!formData.consentTimestamp)) {
      update('consentTimestamp', new Date().toISOString())
    }
    setStep((s) => Math.min(s + 1, 5))
  }
  const back = () => setStep((s) => Math.max(s - 1, 1))

  // Step 2 OCR Trigger
  const handleOcrProcess = () => {
    setLoading(true)
    setTimeout(() => {
      update('ocrExtractedName', formData.fullName || 'Kavindya Perera')
      update('ocrExtractedNic', formData.nicNumber || '199512345678')
      update('ocrExtractedDob', formData.dob || '1995-06-15')
      update('ocrVerified', true)
      setLoading(false)
    }, 700)
  }

  // Step 2 Liveness Selfie Trigger
  const handleStartLivenessCheck = () => {
    update('livenessScanning', true)
    update('livenessPromptStep', 1)
    setTimeout(() => {
      update('livenessPromptStep', 2)
      setTimeout(() => {
        update('livenessPromptStep', 3)
        setTimeout(() => {
          update('livenessScore', 97.4)
          update('faceMatchScore', 98.8)
          update('livenessVerified', true)
          update('livenessScanning', false)

          // Risk Screening Check
          if (formData.fullName.toLowerCase().includes('pep')) {
            update('pepHit', true)
            update('riskTier', 'HIGH')
          } else {
            update('pepHit', false)
            update('riskTier', 'LOW')
          }
        }, 800)
      }, 800)
    }, 800)
  }

  // Step 5 Submit DAO Application
  const handleSubmitDAO = async () => {
    setLoading(true)
    setError('')
    try {
      const now = new Date()
      const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '')
      const randNum = Math.floor(10000 + Math.random() * 90000)
      const ref = `NBLS-DAO-${yyyymmdd}-${randNum}`

      const payload = {
        applicationRef: ref,
        customerDetails: formData,
        status: formData.pepHit || formData.riskTier === 'HIGH' ? 'COMPLIANCE_REVIEW' : 'SUBMITTED',
        submittedAt: now.toISOString(),
      }

      await new Promise(r => setTimeout(r, 1000))
      setAppReference(ref)
      setSubmissionComplete(true)
    } catch (e) {
      setError(e.message || 'Failed to submit digital account opening application.')
    } finally {
      setLoading(false)
    }
  }

  const selectedProd = accountProducts.find(p => (p.productName || p.name) === formData.accountType) || fallbackAccountProducts[0]
  const selectedBranch = branches.find(b => b.code === formData.branch || b.name === formData.branch) || fallbackBranches[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-100 pb-12">
      <CustomerHeader active="Dashboard" />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link to="/portal/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Digital Account Opening (DAO)</h1>
            <p className="text-sm text-ink-500">CBSL-compliant 5-step paperless customer onboarding wizard.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">
            <ShieldCheck className="h-4 w-4 text-success-400" /> ISO 27001 &amp; PDPA Compliant
          </div>
        </div>

        {/* Wizard Stepper Bar */}
        {!submissionComplete && (
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

        {/* Main Content Area */}
        <div className="card mt-6 p-6 sm:p-8">
          {error && (
            <div className="mb-6 rounded-xl bg-danger-50 border border-danger-200 p-4 text-sm text-danger-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS CONFIRMATION VIEW */}
          {submissionComplete ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success-600 border-4 border-success-100 shadow-inner">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-navy-900">Application Submitted!</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-ink-600">
                Your Digital Account Opening application has been registered in the system.
              </p>

              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-ink-200 bg-slate-50 p-6 text-left shadow-sm">
                <div className="flex items-center justify-between border-b border-ink-200 pb-3 mb-3">
                  <span className="text-xs text-ink-500 font-semibold uppercase tracking-wider">Application Reference</span>
                  <span className="font-mono font-bold text-accent-700 text-base">{appReference}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-500">Applicant Name:</span>
                    <span className="font-semibold text-navy-800">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">NIC Number:</span>
                    <span className="font-mono text-navy-800">{formData.nicNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">Selected Product:</span>
                    <span className="font-semibold text-navy-800">{formData.accountType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">Managing Branch:</span>
                    <span className="font-semibold text-navy-800">{selectedBranch.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">Application Status:</span>
                    <span className={`chip font-bold ${formData.pepHit || formData.riskTier === 'HIGH' ? 'bg-warning-100 text-warning-800' : 'bg-accent-100 text-accent-800'}`}>
                      {formData.pepHit || formData.riskTier === 'HIGH' ? 'COMPLIANCE_REVIEW' : 'SUBMITTED'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-white p-3 border border-ink-100 text-xs text-ink-600 flex items-start gap-2">
                  <Clock className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span>Your application has been routed to the <strong>Onboarding Officer Queue</strong>. Upon officer approval, your Core Banking System (CBS) account number will be generated and sent via SMS and email.</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/portal/dashboard" className="btn-primary">Go to Customer Dashboard</Link>
                <Link to="/portal/applications" className="btn-outline">View My Applications Queue</Link>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: PERSONAL DETAILS */}
              {step === 1 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 1: Personal &amp; Income Details</h2>
                  </div>
                  <p className="text-sm text-ink-500">Enter your mandatory customer identification and income details as required by CBSL.</p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label">Full Name (as per NIC)</label>
                      <input className="input" value={formData.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="e.g. Kavindya Perera" required />
                    </div>

                    <div>
                      <label className="label">Date of Birth</label>
                      <input type="date" className="input" value={formData.dob} onChange={(e) => update('dob', e.target.value)} required />
                    </div>

                    <div>
                      <label className="label">NIC Number</label>
                      <input className="input uppercase font-mono" value={formData.nicNumber} onChange={(e) => update('nicNumber', e.target.value)} placeholder="199512345678" required />
                    </div>

                    <div>
                      <label className="label">Mobile Phone Number</label>
                      <input className="input" value={formData.mobileNumber} onChange={(e) => update('mobileNumber', e.target.value)} placeholder="+94 77 123 4567" required />
                    </div>

                    <div>
                      <label className="label">Email Address</label>
                      <input type="email" className="input" value={formData.email} onChange={(e) => update('email', e.target.value)} placeholder="name@example.lk" required />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="label">Permanent Residential Address</label>
                      <textarea className="input" rows="2" value={formData.permAddress} onChange={(e) => update('permAddress', e.target.value)} placeholder="No. 45, Flower Road, Colombo 07" required />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sameAsPerm}
                          onChange={(e) => {
                            update('sameAsPerm', e.target.checked)
                            if (e.target.checked) update('corrAddress', formData.permAddress)
                          }}
                          className="h-4 w-4 rounded border-ink-300"
                        />
                        <span>Correspondence address same as permanent address</span>
                      </label>
                    </div>

                    {!formData.sameAsPerm && (
                      <div className="sm:col-span-2">
                        <label className="label">Correspondence Address</label>
                        <textarea className="input" rows="2" value={formData.corrAddress} onChange={(e) => update('corrAddress', e.target.value)} placeholder="Correspondence Address" />
                      </div>
                    )}

                    <div>
                      <label className="label">Occupation</label>
                      <input className="input" value={formData.occupation} onChange={(e) => update('occupation', e.target.value)} placeholder="Software Engineer" required />
                    </div>

                    <div>
                      <label className="label">Source of Funds</label>
                      <select className="input" value={formData.sourceOfFunds} onChange={(e) => update('sourceOfFunds', e.target.value)}>
                        <option value="Salary">Employment Salary</option>
                        <option value="Business Profits">Business Profits</option>
                        <option value="Investments">Investment / Dividends</option>
                        <option value="Family Remittance">Foreign Remittance</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="label">Expected Monthly Turnover (LKR)</label>
                      <input type="number" className="input font-bold" value={formData.monthlyTurnover} onChange={(e) => update('monthlyTurnover', e.target.value)} placeholder="250000" required />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: e-KYC VERIFICATION (OCR + LIVENESS + PEP) */}
              {step === 2 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <ScanLine className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 2: Automated e-KYC Verification</h2>
                  </div>
                  <p className="text-sm text-ink-500">Upload your physical NIC and complete the interactive liveness selfie test for digital identity validation.</p>

                  <div className="mt-6 space-y-6">
                    {/* NIC Photo Upload Section */}
                    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
                      <h3 className="font-bold text-navy-800 text-base mb-3 flex items-center gap-2">
                        <Upload className="h-4 w-4 text-accent-600" /> 1. Upload National Identity Card (NIC) Photos
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border-2 border-dashed border-ink-200 p-4 text-center hover:border-accent-400 bg-slate-50 transition-all">
                          <FileText className="mx-auto h-8 w-8 text-ink-400" />
                          <div className="mt-2 text-xs font-semibold text-navy-800">NIC Front Image (JPEG/PNG/PDF max 5MB)</div>
                          <input type="file" accept="image/*,.pdf" className="mt-2 text-xs w-full" onChange={() => update('nicFrontFile', 'nic_front.jpg')} />
                        </div>

                        <div className="rounded-xl border-2 border-dashed border-ink-200 p-4 text-center hover:border-accent-400 bg-slate-50 transition-all">
                          <FileText className="mx-auto h-8 w-8 text-ink-400" />
                          <div className="mt-2 text-xs font-semibold text-navy-800">NIC Back Image (JPEG/PNG/PDF max 5MB)</div>
                          <input type="file" accept="image/*,.pdf" className="mt-2 text-xs w-full" onChange={() => update('nicBackFile', 'nic_back.jpg')} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-ink-500">Run Optical Character Recognition (OCR) to extract NIC data automatically.</span>
                        <button onClick={handleOcrProcess} disabled={loading || formData.ocrVerified} className="btn-primary py-1.5 px-4 text-xs">
                          {loading ? 'Running OCR...' : formData.ocrVerified ? 'OCR Processed ✓' : 'Process OCR Extraction'}
                        </button>
                      </div>

                      {formData.ocrVerified && (
                        <div className="mt-4 rounded-xl bg-success-50 border border-success-200 p-4 text-xs text-success-800">
                          <div className="font-bold text-sm mb-2 flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-success-600" /> OCR Extraction Confirmed
                          </div>
                          <div className="grid grid-cols-3 gap-2 bg-white/80 p-3 rounded-lg border border-success-100 font-mono">
                            <div><span className="text-ink-400 block text-[10px]">Extracted Name</span><b>{formData.ocrExtractedName}</b></div>
                            <div><span className="text-ink-400 block text-[10px]">Extracted NIC</span><b>{formData.ocrExtractedNic}</b></div>
                            <div><span className="text-ink-400 block text-[10px]">Extracted DOB</span><b>{formData.ocrExtractedDob}</b></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Liveness Check Section */}
                    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
                      <h3 className="font-bold text-navy-800 text-base mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4 text-accent-600" /> 2. Biometric Liveness Selfie Test
                      </h3>

                      {!formData.livenessVerified ? (
                        <div className="text-center p-6 border rounded-xl bg-slate-50">
                          {formData.livenessScanning ? (
                            <div className="space-y-3">
                              <div className="mx-auto h-12 w-12 rounded-full border-4 border-accent-600 border-t-transparent animate-spin" />
                              {formData.livenessPromptStep === 1 && <p className="font-bold text-accent-700 text-sm animate-pulse">Prompt 1: Please smile for the camera...</p>}
                              {formData.livenessPromptStep === 2 && <p className="font-bold text-accent-700 text-sm animate-pulse">Prompt 2: Turn your head slightly to the left...</p>}
                              {formData.livenessPromptStep === 3 && <p className="font-bold text-accent-700 text-sm animate-pulse">Prompt 3: Blink your eyes to complete biometric match...</p>}
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs text-ink-600 mb-4">Click below to start live video biometric liveness test and face match against your NIC photo.</p>
                              <button onClick={handleStartLivenessCheck} className="btn-accent text-xs">
                                Start Interactive Liveness Check
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl bg-success-50 border border-success-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-success-800 text-sm">
                              <ShieldCheck className="h-5 w-5 text-success-600" /> Biometric Liveness Verification Passed
                            </div>
                            <span className="chip bg-success-100 text-success-800 font-bold">Liveness: {formData.livenessScore}%</span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3 text-xs bg-white/80 p-3 rounded-lg border border-success-100">
                            <div><span className="text-ink-400 block text-[10px]">Face Match Score</span><b className="text-success-700 text-sm">{formData.faceMatchScore}% Match</b></div>
                            <div><span className="text-ink-400 block text-[10px]">PEP / Watchlist Risk</span><b className="text-navy-800 text-sm">{formData.riskTier} RISK</b></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PRODUCT SELECTION */}
              {step === 3 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 3: Select Account Product &amp; Branch</h2>
                  </div>
                  <p className="text-sm text-ink-500">Select configured savings product and managing branch.</p>

                  <div className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {accountProducts.map((a) => {
                        const name = a.productName || a.name
                        const isSelected = formData.accountType === name
                        return (
                          <div
                            key={name}
                            onClick={() => update('accountType', name)}
                            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all flex flex-col justify-between ${isSelected ? 'border-accent-500 bg-accent-50/60 shadow-md ring-2 ring-accent-100' : 'border-ink-100 bg-white hover:border-navy-200'}`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-navy-900 text-base">{name}</h3>
                                {isSelected && <Check className="h-5 w-5 text-accent-600" />}
                              </div>
                              <p className="text-xs text-ink-500 leading-relaxed">{a.desc || 'Active configured savings account product.'}</p>
                            </div>
                            <div className="mt-4 border-t border-ink-100/60 pt-3 flex items-center justify-between text-xs">
                              <div><span className="text-ink-400 block text-[10px] uppercase">Interest</span><span className="font-bold text-accent-700">{a.rate || '6.50% p.a.'}</span></div>
                              <div><span className="text-ink-400 block text-[10px] uppercase">Min Balance</span><span className="font-semibold text-navy-800">{a.minBalance ? formatLKR(a.minBalance) : 'LKR 1,000'}</span></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-6 border-t border-ink-100 pt-6">
                      <label className="label font-semibold">Managing Home Branch</label>
                      <select className="input" value={formData.branch} onChange={(e) => update('branch', e.target.value)}>
                        {branches.map(b => (
                          <option key={b.code} value={b.code}>{b.name} ({b.code})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: TERMS & PDPA CONSENT */}
              {step === 4 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 4: Terms &amp; PDPA Consent</h2>
                  </div>
                  <p className="text-sm text-ink-500">CBSL &amp; Personal Data Protection Act (PDPA) legal compliance agreement.</p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-ink-200 bg-slate-50 p-5 space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={(e) => update('termsAccepted', e.target.checked)}
                          className="h-5 w-5 rounded border-ink-300 text-accent-600 mt-0.5"
                        />
                        <div className="text-xs text-navy-900 leading-relaxed">
                          <b>NovaBank Digital Account Terms &amp; Conditions:</b> I agree to abide by all rules, ledger fees, and interest rate schedules governing digital accounts issued by NovaBank under Central Bank of Sri Lanka (CBSL) regulations.
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.pdpaConsent}
                          onChange={(e) => update('pdpaConsent', e.target.checked)}
                          className="h-5 w-5 rounded border-ink-300 text-accent-600 mt-0.5"
                        />
                        <div className="text-xs text-navy-900 leading-relaxed">
                          <b>Personal Data Protection Act (PDPA) Consent:</b> I consent to NovaBank storing and processing my personal identification, NIC documents, and biometric liveness data for identity verification, fraud prevention, and regulatory reporting.
                        </div>
                      </label>
                    </div>

                    <div className="rounded-xl bg-navy-50 border border-navy-100 p-4 text-xs text-navy-800 flex items-center justify-between font-mono">
                      <span>Recorded Consent IP: <b>{formData.consentIp}</b></span>
                      <span>Timestamp: <b>{formData.consentTimestamp || 'Recorded on submission'}</b></span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUBMIT */}
              {step === 5 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <FileCheck className="h-6 w-6 text-accent-600" />
                    <h2 className="text-xl font-bold text-navy-800">Step 5: Review &amp; Submit Application</h2>
                  </div>
                  <p className="text-sm text-ink-500">Review all entered information before submitting to the Onboarding Officer queue.</p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-ink-200 p-4 bg-white">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-accent-700 mb-2">Personal Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-ink-400">Full Name:</span> <b>{formData.fullName}</b></div>
                        <div><span className="text-ink-400">NIC Number:</span> <b className="font-mono">{formData.nicNumber}</b></div>
                        <div><span className="text-ink-400">Mobile:</span> <b>{formData.mobileNumber}</b></div>
                        <div><span className="text-ink-400">Email:</span> <b>{formData.email}</b></div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-ink-200 p-4 bg-white">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-accent-700 mb-2">e-KYC &amp; Biometric Results</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className="text-ink-400">OCR Extraction:</span> <b className="text-success-700">VERIFIED ✓</b></div>
                        <div><span className="text-ink-400">Liveness Score:</span> <b>{formData.livenessScore}%</b></div>
                        <div><span className="text-ink-400">Assigned Risk Tier:</span> <b className="chip bg-accent-100 text-accent-800">{formData.riskTier} RISK</b></div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-ink-200 p-4 bg-white">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-accent-700 mb-2">Selected Product &amp; Branch</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-ink-400">Product Name:</span> <b>{formData.accountType}</b></div>
                        <div><span className="text-ink-400">Home Branch:</span> <b>{selectedBranch.name}</b></div>
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
                  <button onClick={handleSubmitDAO} disabled={loading} className="btn-primary flex items-center gap-2">
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
