import * as Icons from 'lucide-react'
import { statusConfig } from '../data/mockData'

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, color: 'ink', icon: 'Circle' }
  const Icon = Icons[cfg.icon] || Icons.Circle
  const colorClasses = {
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
    accent: 'bg-accent-50 text-accent-700',
    ink: 'bg-ink-100 text-ink-600',
  }
  return (
    <span className={`chip ${colorClasses[cfg.color]}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  )
}
