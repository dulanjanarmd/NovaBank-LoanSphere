import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, ShieldCheck, UserCheck, Settings, ArrowRight, Lock } from 'lucide-react'
import Logo from '../components/Logo'
import { staffRoles } from '../data/mockData'

export default function StaffLoginPage() {
  const [role, setRole] = useState('officer')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-accent-700 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center"><Logo light /></div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-2 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700 text-white"><Lock className="h-6 w-6" /></div>
            <h1 className="text-xl font-bold text-navy-800">Staff Portal Sign In</h1>
            <p className="text-sm text-ink-500">Select your role to continue.</p>
          </div>

          <div className="mt-6 space-y-2">
            {staffRoles.map((r) => {
              const Icon = { officer: Building2, compliance: ShieldCheck, manager: UserCheck, admin: Settings }[r.id]
              return (
                <button key={r.id} onClick={() => setRole(r.id)} className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${role === r.id ? 'border-accent-500 bg-accent-50' : 'border-ink-100 hover:border-navy-200'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${role === r.id ? 'bg-navy-700 text-white' : 'bg-ink-100 text-ink-500'}`}><Icon className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-navy-800">{r.name}</div>
                    <div className="text-xs text-ink-500">{r.description}</div>
                  </div>
                  {role === r.id && <div className="mt-1 h-5 w-5 rounded-full bg-accent-500" />}
                </button>
              )
            })}
          </div>

          <Link to={`/staff?role=${role}`} className="btn-primary mt-6 w-full">
            Continue as {staffRoles.find((r) => r.id === role)?.name}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs font-medium text-ink-500 hover:text-navy-700">← Back to customer site</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
