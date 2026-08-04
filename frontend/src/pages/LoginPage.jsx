import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Lock, User, Phone, Building2, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react'
import Logo, { TrustBar } from '../components/Logo'
import { api } from '../services/api'

export default function LoginPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [pendingIdentifier, setPendingIdentifier] = useState('')
  const [devOtpHint, setDevOtpHint] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/portal/open-account'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    
    try {
      if (mode === 'login') {
        const email = formData.get('email')
        const password = formData.get('password')
        
        const response = await api.login(email, password)
        
        if (response.success) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          navigate(from, { replace: true })
        } else {
          setError(response.message || 'Login failed')
        }
      } else {
        const registerData = {
          nicNumber: formData.get('nic'),
          fullName: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          mobileNumber: formData.get('mobile'),
          address: formData.get('address') || 'Sri Lanka',
          occupation: formData.get('occupation') || 'Other',
          sourceOfFunds: formData.get('sourceOfFunds') || 'Salary',
          monthlyTurnover: parseFloat(formData.get('monthlyTurnover')) || 0,
          password: formData.get('password'),
        }
        
        const response = await api.register(registerData)
        
        if (response.requiresOtp) {
          setOtpStep(true)
          setPendingIdentifier(registerData.nicNumber || registerData.email)
          if (response._devOtp) setDevOtpHint(response._devOtp)
        } else if (response.success) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          navigate('/portal/open-account', { replace: true })
        } else {
          setError(response.message || 'Registration failed')
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.verifyOtp(pendingIdentifier, otpInput)
      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        navigate('/portal/open-account', { replace: true })
      } else {
        setError(response.message || 'Invalid OTP verification code.')
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-navy-800 via-navy-700 to-accent-700 p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div>
          <div className="relative mb-24"><Logo light /></div>
          <div className="relative">
            <h2 className="text-3xl font-bold leading-tight">Welcome to NovaBank LoanSphere.</h2>
            <p className="mt-3 max-w-md text-navy-100">Open accounts, apply for loans and track every step - all in one secure place.</p>
            <div className="mt-8 space-y-3">
              {['Bank-grade 256-bit encryption', 'Two-factor authentication', 'CBSL-regulated & ISO 27001 certified'].map((t) => (
                <div key={t} className="flex items-center gap-2.5 text-sm text-navy-100"><CheckCircle className="h-5 w-5 text-success-400" /> {t}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative"><TrustBar /></div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-ink-50 p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <div className="card p-8">
            <div className="mb-6 flex rounded-lg bg-ink-100 p-1">
              <button onClick={() => setMode('login')} className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-white text-navy-800 shadow-sm' : 'text-ink-500'}`}>Sign In</button>
              <button onClick={() => setMode('register')} className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${mode === 'register' ? 'bg-white text-navy-800 shadow-sm' : 'text-ink-500'}`}>Register</button>
            </div>

            <h1 className="text-2xl font-bold text-navy-800">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-1 text-sm text-ink-500">{mode === 'login' ? 'Sign in to manage your loans and accounts.' : 'Join NovaBank to apply for loans online.'}</p>

            {otpStep ? (
              <form onSubmit={handleVerifyOtpSubmit} className="mt-6 space-y-4">
                <div className="rounded-xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-800">
                  <div className="font-bold mb-1">Mobile &amp; Email Verification OTP Sent</div>
                  <p className="text-xs text-ink-600">Enter the 6-digit authentication code sent to your registered mobile and email to complete registration.</p>
                  {devOtpHint && (
                    <div className="mt-2 text-xs font-mono font-bold text-accent-700 bg-white/80 p-2 rounded border border-accent-200">
                      [Demo OTP Code]: <span className="text-sm underline tracking-widest">{devOtpHint}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">6-Digit Verification OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    className="input text-center font-mono text-xl font-bold tracking-widest"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Complete Registration'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  className="btn-ghost w-full text-xs text-ink-500"
                  onClick={() => setOtpStep(false)}
                >
                  ← Back to Registration Form
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">First name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                        <input name="firstName" className="input pl-9" placeholder="Kavindya" required />
                      </div>
                    </div>
                    <div>
                      <label className="label">Last name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                        <input name="lastName" className="input pl-9" placeholder="Perera" required />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="label">NIC Number</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                      <input name="nic" className="input pl-9" placeholder="199234509123" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Mobile number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                      <input name="mobile" className="input pl-9" placeholder="+94 77 123 4567" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Address</label>
                    <input name="address" className="input" placeholder="No. 45, Flower Road, Colombo 07" required />
                  </div>
                  <div>
                    <label className="label">Occupation</label>
                    <input name="occupation" className="input" placeholder="Software Engineer" required />
                  </div>
                  <div>
                    <label className="label">Source of Funds</label>
                    <select name="sourceOfFunds" className="input" required>
                      <option value="">Select source</option>
                      <option value="Salary">Salary</option>
                      <option value="Business Revenue">Business Revenue</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Monthly Turnover (LKR)</label>
                    <input name="monthlyTurnover" type="number" className="input" placeholder="250000" required />
                  </div>
                </>
              )}
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                  <input name="email" type="email" className="input pl-9" placeholder="you@example.lk" required />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                  <input name="password" type="password" className="input pl-9" placeholder="********" required />
                </div>
              </div>
              {mode === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-ink-600"><input type="checkbox" className="rounded border-ink-300" /> Remember me</label>
                  <Link to="/forgot-password" className="font-medium text-accent-600 hover:text-accent-700">Forgot password?</Link>
                </div>
              )}
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
            )}



            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-500">
              <ShieldCheck className="h-3.5 w-3.5 text-success-600" /> Protected by 256-bit encryption
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-semibold text-accent-600 hover:text-accent-700">
              {mode === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
