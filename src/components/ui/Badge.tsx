import type { ReactNode } from 'react'
import type { Urgency, TaskStatus } from '../../types'

const urgencyStyles: Record<Urgency, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
}

const urgencyLabel: Record<Urgency, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${urgencyStyles[urgency]}`}>
      {urgencyLabel[urgency]}
    </span>
  )
}

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-sky-100 text-sky-700',
  done: 'bg-emerald-100 text-emerald-700',
}

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabel[status]}
    </span>
  )
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200"
      style={color ? { backgroundColor: `${color}1a`, color, boxShadow: 'none' } : undefined}
    >
      {children}
    </span>
  )
}
