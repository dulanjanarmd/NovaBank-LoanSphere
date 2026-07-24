import { Link } from 'react-router-dom'
import { Bell, CheckCircle, AlertCircle, Info, Check, Trash2, Settings } from 'lucide-react'
import { useState } from 'react'
import CustomerHeader from '../components/CustomerHeader'
import { notificationTemplates, formatDateTime } from '../data/mockData'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationTemplates)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter)
  const markRead = (id) => setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)))
  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })))
  const remove = (id) => setNotifications((n) => n.filter((x) => x.id !== id))

  const config = {
    success: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50' },
    warning: { icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-50' },
    info: { icon: Info, color: 'text-accent-600', bg: 'bg-accent-50' },
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <CustomerHeader active="Notifications" />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Notifications</h1>
            <p className="text-sm text-ink-500">Stay up to date with your applications and account activity.</p>
          </div>
          <button onClick={markAllRead} className="btn-outline"><Check className="h-4 w-4" /> Mark all as read</button>
        </div>

        <div className="card mb-4 p-2">
          <div className="flex gap-2">
            {['all', 'success', 'warning', 'info'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-navy-700 text-white' : 'text-ink-600 hover:bg-ink-50'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="card divide-y divide-ink-50">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="mx-auto h-10 w-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">No notifications to show.</p>
            </div>
          ) : (
            filtered.map((n) => {
              const c = config[n.type] || config.info
              const Icon = c.icon
              return (
                <div key={n.id} className={`flex gap-3 p-4 transition-colors ${n.read ? '' : c.bg}`}>
                  <Icon className={`h-5 w-5 flex-shrink-0 ${c.color}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-navy-800">{n.title}</div>
                      <div className="flex items-center gap-1">
                        {!n.read && <span className="h-2 w-2 rounded-full bg-accent-500" />}
                        <button onClick={() => remove(n.id)} className="p-1 text-ink-300 hover:text-danger-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <div className="mt-0.5 text-sm text-ink-600">{n.body}</div>
                    <div className="mt-1.5 text-[11px] text-ink-400">{formatDateTime(n.time)}</div>
                    {!n.read && <button onClick={() => markRead(n.id)} className="mt-2 text-xs font-semibold text-accent-600 hover:text-accent-700">Mark as read</button>}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-500">
          <Settings className="h-3.5 w-3.5" /> <Link to="#" className="hover:text-navy-700">Manage notification preferences</Link>
        </div>
      </main>
    </div>
  )
}
