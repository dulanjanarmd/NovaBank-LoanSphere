import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, Clock, ArrowUpRight, Plus, FileText, CreditCard, Bell, CheckCircle, AlertCircle, Volume2, VolumeX } from 'lucide-react'
import CustomerHeader from '../components/CustomerHeader'
import StatusBadge from '../components/StatusBadge'
import Chatbot from '../components/Chatbot'
import { api } from '../services/api'

function formatLKR(amount) {
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        setUser(userData)

        if (userData?.customerId) {
          try {
            const [accountsRes, appsRes, notifRes] = await Promise.all([
              api.getCustomerAccounts(userData.customerId),
              api.getCustomerApplications(userData.customerId),
              api.getNotifications(userData.customerId)
            ])
            setAccounts(accountsRes.data || [])
            setApplications(appsRes.data || [])
            setNotifications(notifRes.data || [])
          } catch (_) {
            // Error fetching
            setAccounts([])
            setApplications([])
            setNotifications([])
          }
        } else {
          // No user ID
          setAccounts([])
          setApplications([])
          setNotifications([])
        }
      } catch (err) {
        console.error('Dashboard load error:', err)
        setAccounts([])
        setApplications([])
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Voice welcome message
  useEffect(() => {
    if (!loading && voiceEnabled && user) {
      const hour = new Date().getHours()
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
      const welcomeMessage = `${timeGreeting} and welcome to NovaBank, ${user.fullName || 'Customer'}. Your dashboard is now ready.`
      
      // Check if browser supports speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(welcomeMessage)
        utterance.rate = 0.9 // Slightly slower for better clarity
        utterance.pitch = 1
        utterance.volume = 1
        
        // Try to use a natural English voice
        const voices = window.speechSynthesis.getVoices()
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'))
        if (englishVoice) {
          utterance.voice = englishVoice
        }
        
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          window.speechSynthesis.speak(utterance)
        }, 500)
      }
    }
  }, [loading, voiceEnabled, user])

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (!voiceEnabled) {
      // If enabling, trigger welcome message again
      const hour = new Date().getHours()
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
      const welcomeMessage = `${timeGreeting} and welcome to NovaBank, ${user?.fullName || 'Customer'}. Your dashboard is now ready.`
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(welcomeMessage)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0)
  const activeLoans = applications.filter((a) => a.status === 'APPROVED' || a.status === 'DISBURSED')
  const pendingApps = applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-100">
      <CustomerHeader active="Dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Welcome */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">{greeting}, {user?.fullName || 'Customer'}</h1>
            <p className="text-sm text-ink-500">Here's a snapshot of your accounts and applications.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleVoice}
              className={`btn-outline ${voiceEnabled ? 'bg-accent-50 text-accent-700 border-accent-300' : ''}`}
              title={voiceEnabled ? 'Disable voice assistant' : 'Enable voice assistant'}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {voiceEnabled ? 'Voice On' : 'Voice Off'}
            </button>
            <Link to="/portal/open-account" className="btn-outline"><Plus className="h-4 w-4" /> Open Account</Link>
            <Link to="/portal/apply" className="btn-primary"><CreditCard className="h-4 w-4" /> Apply for Loan</Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-ink-500">Loading...</div>
          </div>
        ) : (
          <>
        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700"><Wallet className="h-5 w-5" /></div>
              <span className="chip bg-success-50 text-success-700"><ArrowUpRight className="h-3 w-3" /> +2.4%</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Total Balance</div>
            <div className="text-xl font-bold text-navy-800">{formatLKR(totalBalance)}</div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><TrendingUp className="h-5 w-5" /></div>
              <span className="chip bg-accent-50 text-accent-700">Active</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Active Loans</div>
            <div className="text-xl font-bold text-navy-800">{activeLoans.length}</div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-50 text-warning-600"><Clock className="h-5 w-5" /></div>
              <span className="chip bg-warning-50 text-warning-700">In progress</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Pending Applications</div>
            <div className="text-xl font-bold text-navy-800">{pendingApps.length}</div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><FileText className="h-5 w-5" /></div>
              <span className="chip bg-ink-100 text-ink-600">This month</span>
            </div>
            <div className="mt-3 text-xs font-medium text-ink-500">Total Applications</div>
            <div className="text-xl font-bold text-navy-800">{applications.length}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Accounts */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-ink-100 p-5">
              <h2 className="font-bold text-navy-800">My Accounts</h2>
              <button className="text-sm font-medium text-accent-600 hover:text-accent-700">View all</button>
            </div>
            <div className="divide-y divide-ink-50">
              {accounts.length > 0 ? accounts.map((acc) => (
                <div key={acc.accountId} className="flex items-center justify-between p-5 transition-colors hover:bg-navy-50/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-700 text-white"><Wallet className="h-5 w-5" /></div>
                    <div>
                      <div className="text-sm font-semibold text-navy-800">{acc.productName}</div>
                      <div className="text-xs text-ink-500">{acc.accountNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-navy-800">{formatLKR(0)}</div>
                    <div className="text-xs text-ink-500">Opened {formatDate(acc.createdAt)}</div>
                  </div>
                </div>
              )) : (
                <div className="p-5 text-center text-ink-500">No accounts yet</div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-ink-100 p-5">
              <h2 className="font-bold text-navy-800">Recent Notifications</h2>
              <Link to="/portal/notifications" className="text-sm font-medium text-accent-600 hover:text-accent-700">View all</Link>
            </div>
            <div className="divide-y divide-ink-50">
              {notifications.length > 0 ? notifications.slice(0, 3).map((n) => {
                const Icon = n.type === 'success' ? CheckCircle : n.type === 'warning' ? AlertCircle : Bell
                const color = n.type === 'success' ? 'text-success-600' : n.type === 'warning' ? 'text-warning-600' : 'text-accent-600'
                return (
                  <div key={n.id} className="flex gap-3 p-4">
                    <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
                    <div>
                      <div className="text-sm font-semibold text-navy-800">{n.title}</div>
                      <div className="mt-0.5 text-xs text-ink-500">{n.body}</div>
                      <div className="mt-1 text-[11px] text-ink-400">{formatDate(n.createdAt)}</div>
                    </div>
                  </div>
                )
              }) : (
                <div className="p-5 text-center text-ink-500">No notifications</div>
              )}
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="card mt-6">
          <div className="flex items-center justify-between border-b border-ink-100 p-5">
            <h2 className="font-bold text-navy-800">My Applications</h2>
            <Link to="/portal/applications" className="text-sm font-medium text-accent-600 hover:text-accent-700">View all</Link>
          </div>
          <div className="divide-y divide-ink-50">
            {applications.length > 0 ? applications.map((app) => (
              <Link key={app.applicationId} to={`/portal/applications/${app.applicationId}`} className="flex items-center justify-between p-5 transition-colors hover:bg-navy-50/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><CreditCard className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold text-navy-800">{app.loanType}</div>
                    <div className="text-xs text-ink-500">{app.applicationRef} · Submitted {formatDate(app.submittedAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-navy-800">{formatLKR(app.requestedAmount)}</div>
                    <div className="text-xs text-ink-500">{app.tenureMonths} months</div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </Link>
            )) : (
              <div className="p-5 text-center text-ink-500">No applications yet</div>
            )}
          </div>
        </div>
          </>
        )}
      </main>
      <Chatbot />
    </div>
  )
}
