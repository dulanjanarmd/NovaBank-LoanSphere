import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, User, Shield, CreditCard, Loader2 } from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import { api } from '../services/api'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getMyProfile()
        if (data.success && data.profile) {
          setProfile(data.profile)
        } else {
          const stored = localStorage.getItem('user')
          if (stored) {
            setProfile(JSON.parse(stored))
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        const stored = localStorage.getItem('user')
        if (stored) {
          setProfile(JSON.parse(stored))
        } else {
          setError(err.message || 'Could not load profile')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex items-center gap-2 text-ink-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-danger-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <CustomerHeader active="Profile" />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link to="/portal/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-navy-700 to-accent-600 px-6 py-8 text-white sm:px-10">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full ios-glass/20 text-xl font-bold shadow-lg">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile?.fullName || 'User'}</h1>
                <p className="text-sm text-white/80">{profile?.role === 'CUSTOMER' ? 'Retail Customer' : (profile?.role || 'User')}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="text-lg font-bold text-navy-800 mb-5">Personal Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-ink-500">Full Name</div>
                  <div className="text-sm font-semibold text-navy-800">{profile?.fullName || '-'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-ink-500">NIC / Username</div>
                  <div className="text-sm font-semibold text-navy-800">{profile?.username || '-'}</div>
                </div>
              </div>
              {profile?.email && (
                <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-500">Email Address</div>
                    <div className="text-sm font-semibold text-navy-800">{profile.email}</div>
                  </div>
                </div>
              )}
              {profile?.mobileNumber && (
                <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-500">Mobile Number</div>
                    <div className="text-sm font-semibold text-navy-800">{profile.mobileNumber}</div>
                  </div>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-500">Address</div>
                    <div className="text-sm font-semibold text-navy-800">{profile.address}</div>
                  </div>
                </div>
              )}
              {profile?.occupation && (
                <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-500">Occupation</div>
                    <div className="text-sm font-semibold text-navy-800">{profile.occupation}</div>
                  </div>
                </div>
              )}
              {profile?.sourceOfFunds && (
                <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-500">Source of Funds</div>
                    <div className="text-sm font-semibold text-navy-800">{profile.sourceOfFunds}</div>
                  </div>
                </div>
              )}
              {profile?.branch && (
                <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-500">Branch</div>
                    <div className="text-sm font-semibold text-navy-800">{profile.branch}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
