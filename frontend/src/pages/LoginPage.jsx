import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Lock, User, Phone, Building2, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react'
import Logo, { TrustBar } from '../components/Logo'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/portal/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-navy-800 via-navy-700 to-accent-700 p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative"><Logo light /></div>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight">Welcome to NovaBank LoanSphere.</h2>
          <p className="mt-3 max-w-md text-navy-100">Open accounts, apply for loans and track every step — all in one secure place.</p>
          <div className="mt-8 space-y-3">
            {['Bank-grade 256-bit encryption', 'Two-factor authentication', 'CBSL-regulated & ISO 27001 certified'].map((t) => (
              <div key={t} className="flex items-center gap-2.5 text-sm text-navy-100"><CheckCircle className="h-5 w-5 text-success-400" /> {t}</div>
            ))}
          </div>
        </div>
        <div className="relative"><TrustBar /></div>
      </div>

      {/* Right form panel */}
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">First name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                      <input className="input pl-9" placeholder="Kavindya" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Last name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                      <input className="input pl-9" placeholder="Perera" required />
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                  <input type="email" className="input pl-9" placeholder="you@example.lk" required />
                </div>
              </div>
              {mode === 'register' && (
                <div>
                  <label className="label">Mobile number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                    <input className="input pl-9" placeholder="+94 77 123 4567" required />
                  </div>
                </div>
              )}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                  <input type="password" className="input pl-9" placeholder="••••••••" required />
                </div>
              </div>
              {mode === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-ink-600"><input type="checkbox" className="rounded border-ink-300" /> Remember me</label>
                  <a href="#" className="font-medium text-accent-600 hover:text-accent-700">Forgot password?</a>
                </div>
              )}
              <button type="submit" className="btn-primary w-full">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
              <div className="h-px flex-1 bg-ink-200" /> OR <div className="h-px flex-1 bg-ink-200" />
            </div>
            <Link to="/staff" className="btn-outline w-full">
              <Building2 className="h-4 w-4" /> Staff Portal Login
            </Link>

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
