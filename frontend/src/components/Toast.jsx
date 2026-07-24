import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  if (!toast) return null
  const config = {
    success: { icon: CheckCircle, bg: 'bg-success-50', border: 'border-success-100', text: 'text-success-700', iconColor: 'text-success-600' },
    error: { icon: XCircle, bg: 'bg-danger-50', border: 'border-danger-100', text: 'text-danger-700', iconColor: 'text-danger-600' },
    warning: { icon: AlertCircle, bg: 'bg-warning-50', border: 'border-warning-100', text: 'text-warning-700', iconColor: 'text-warning-600' },
    info: { icon: Info, bg: 'bg-accent-50', border: 'border-accent-100', text: 'text-accent-700', iconColor: 'text-accent-600' },
  }
  const c = config[toast.type] || config.info
  const Icon = c.icon
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slideUp">
      <div className={`flex items-start gap-3 rounded-xl border ${c.border} ${c.bg} p-4 shadow-cardHover`}>
        <Icon className={`h-5 w-5 flex-shrink-0 ${c.iconColor}`} />
        <div className="flex-1">
          <div className={`text-sm font-semibold ${c.text}`}>{toast.title}</div>
          {toast.body && <div className="mt-0.5 text-xs text-ink-600">{toast.body}</div>}
        </div>
        <button onClick={onClose} className="text-ink-400 hover:text-ink-700"><X className="h-4 w-4" /></button>
      </div>
    </div>
  )
}
