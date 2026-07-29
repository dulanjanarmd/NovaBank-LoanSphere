import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ShieldCheck, UserCheck, Settings, ArrowRight, Lock, User, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'

// Seeded staff credentials for demo/offline fallback
const MOCK_STAFF = {
  officer: { username: 'officer', passwordHash: 'password', fullName: 'Aruni Perera', role: 'LOAN_OFFICER', branch: 'Colombo Fort' },
  compliance: { username: 'compliance', passwordHash: 'password', fullName: 'Sajith Silva', role: 'COMPLIANCE_OFFICER', branch: 'Head Office' },
  manager: { username: 'manager', passwordHash: 'password', fullName: 'Niranjan Jayawardena', role: 'BRANCH_MANAGER', branch: 'Colombo Fort' },
  admin: { username: 'admin', passwordHash: 'password', fullName: 'Admin Sphere', role: 'ADMIN', branch: 'Head Office' },
}

const ROLE_META = {
  LOAN_OFFICER: { id: 'officer', label: 'Loan Officer', icon: Building2, description: 'Review applications, verify documents, submit recommendations' },
  COMPLIANCE_OFFICER: { id: 'compliance', label: 'Compliance Officer', icon: ShieldCheck, description: 'AML, KYC and credit checks, risk scoring' },
  BRANCH_MANAGER: { id: 'manager', label: 'Branch Manager', icon: UserCheck, description: 'Final approval authority for branch applications' },
  ADMIN: { id: 'admin', label: 'System Administrator', icon: Settings, description: 'Manage products, rates, users and configuration' },
}

export default function StaffLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Try real backend first
      let staffUser = null
      try {
        const res = await fetch('http://localhost:8080/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          signal: AbortSignal.timeout(3000),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.user) {
            const u = data.user
            const roleMeta = ROLE_META[u.role]
            if (!roleMeta) {
              // Customer account — not allowed here
              setError('This portal is for staff only. Customers please use the main login page.')
              setLoading(false)
              return
            }
            staffUser = {
              username: u.username || username,
              fullName: u.fullName,
              role: u.role,
              roleId: roleMeta.id,
              branch: u.branch,
              token: data.token,
            }
          }
        }
      } catch (_) {
        // Backend offline — use mock fallback
      }

      // Mock fallback: check seeded credentials
      if (!staffUser) {
        const found = Object.values(MOCK_STAFF).find(
          (s) => s.username === username.trim() && s.passwordHash === password
        )
        if (!found) {
          setError('Invalid username or password. (Demo: try officer / password)')
          setLoading(false)
          return
        }
        const roleMeta = ROLE_META[found.role]
        staffUser = {
          username: found.username,
          fullName: found.fullName,
          role: found.role,
          roleId: roleMeta.id,
          branch: found.branch,
          token: 'mock-token',
        }
      }

      localStorage.setItem('staffUser', JSON.stringify(staffUser))
      navigate(`/staff?role=${staffUser.roleId}`)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-accent-700 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo light />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700 text-white">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-navy-800">Staff Portal Sign In</h1>
            <p className="text-sm text-ink-500">Enter your NovaBank staff credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Staff Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                <input
                  type="text"
                  className="input pl-9"
                  placeholder="e.g. officer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                <input
                  type="password"
                  className="input pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In to Staff Portal'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 rounded-lg bg-ink-50 p-3">
            <div className="mb-2 text-xs font-semibold text-ink-600">Demo Credentials</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-ink-500">
              {Object.values(MOCK_STAFF).map((s) => {
                const meta = ROLE_META[s.role]
                const Icon = meta.icon
                return (
                  <button
                    key={s.username}
                    type="button"
                    onClick={() => { setUsername(s.username); setPassword('password') }}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-ink-100"
                  >
                    <Icon className="h-3 w-3 text-accent-500" />
                    <span className="font-medium">{s.username}</span>
                    <span className="text-ink-400">/ password</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs font-medium text-ink-500 hover:text-navy-700">← Back to customer site</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
