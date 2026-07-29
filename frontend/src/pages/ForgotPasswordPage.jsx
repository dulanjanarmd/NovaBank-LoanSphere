import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo'
import { api } from '../services/api'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRequestCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.forgotPassword(email)
      if (response.success) {
        setSuccess('A verification code has been sent to your email. Please check your inbox.')
        setStep(2)
      } else {
        setError(response.message || 'Failed to send reset code')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.verifyResetCode(email, code)
      if (response.success) {
        setSuccess('Code verified successfully. Please set your new password.')
        setStep(3)
      } else {
        setError(response.message || 'Invalid or expired code')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await api.resetPassword(email, code, newPassword)
      if (response.success) {
        setSuccess('Password reset successfully! You can now sign in with your new password.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(response.message || 'Failed to reset password')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
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
            <h2 className="text-3xl font-bold leading-tight">Reset Your Password</h2>
            <p className="mt-3 max-w-md text-navy-100">Securely recover your account through our multi-step verification process.</p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-navy-100"><CheckCircle className="h-5 w-5 text-success-400" /> Email verification required</div>
              <div className="flex items-center gap-2.5 text-sm text-navy-100"><CheckCircle className="h-5 w-5 text-success-400" /> Secure code sent to your inbox</div>
              <div className="flex items-center gap-2.5 text-sm text-navy-100"><CheckCircle className="h-5 w-5 text-success-400" /> Set a new strong password</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-navy-200">
            <ShieldCheck className="h-4 w-4" />
            Protected by 256-bit encryption
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-ink-50 p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <div className="card p-8">
            <Link to="/login" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>

            <h1 className="text-2xl font-bold text-navy-800">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify Code'}
              {step === 3 && 'Set New Password'}
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
              {step === 3 && 'Create a new secure password'}
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-lg bg-success-50 p-3 text-sm text-success-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {success}
                </div>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleRequestCode} className="mt-6 space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                    <input
                      type="email"
                      className="input pl-9"
                      placeholder="you@example.lk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Verification Code'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}

            {/* Step 2: Verification Code */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
                <div>
                  <label className="label">Verification Code</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                    <input
                      type="text"
                      className="input pl-9"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink-500">
                    Code sent to <span className="font-medium text-navy-700">{email}</span>
                  </p>
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setError('')
                    setSuccess('')
                  }}
                  className="btn-outline w-full"
                >
                  Change email
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                    <input
                      type="password"
                      className="input pl-9"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                    <input
                      type="password"
                      className="input pl-9"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-ink-50 p-3 text-xs text-ink-500">
                  <div className="font-medium text-ink-700 mb-1">Password requirements:</div>
                  <ul className="space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains both letters and numbers</li>
                    <li>• Recommended: Include special characters</li>
                  </ul>
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(2)
                    setError('')
                    setSuccess('')
                  }}
                  className="btn-outline w-full"
                >
                  Back
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-500">
              <ShieldCheck className="h-3.5 w-3.5 text-success-600" /> Protected by 256-bit encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
