import { FileText, GripVertical } from 'lucide-react'
import type { Task } from '../../types'
import { UrgencyBadge } from '../ui/Badge'
import { getContactsByIds } from '../../mockData'

interface TaskCardProps {
  task: Task
  onOpen: (task: Task) => void
  dragHandleProps?: Record<string, unknown>
  isDragging?: boolean
}

export function TaskCard({ task, onOpen, dragHandleProps, isDragging }: TaskCardProps) {
  const contacts = getContactsByIds(task.contactIds)
  const isJobSearch = task.categoryId === 'job-search'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(task)
      }}
      className={`group relative cursor-pointer rounded-xl bg-white p-3.5 pr-7 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {dragHandleProps && (
        <span
          {...dragHandleProps}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-1.5 top-1.5 cursor-grab touch-none rounded p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
          aria-label="Drag to move"
        >
          <GripVertical size={14} />
        </span>
      )}

      {isJobSearch && task.companyName && (
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-orange-500">{task.companyName}</p>
      )}
      <p className="text-sm font-medium text-slate-800">{task.title}</p>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <UrgencyBadge urgency={task.urgency} />
        {task.eventDate && (
          <span className="text-xs text-slate-400">
            {new Date(task.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {contacts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {contacts.map((c) => (
            <span key={c.id} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {c.name}
            </span>
          ))}
        </div>
      )}

      {task.attachments.length > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpen(task)
          }}
          className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          <FileText size={13} />
          View CV
        </button>
      )}
    </div>
  )
}
