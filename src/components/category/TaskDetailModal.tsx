import { Mail, Phone, FileText, Calendar } from 'lucide-react'
import type { Task } from '../../types'
import { Modal } from '../ui/Modal'
import { StatusBadge, UrgencyBadge } from '../ui/Badge'
import { getContactsByIds } from '../../mockData'

interface TaskDetailModalProps {
  task: Task | null
  onClose: () => void
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  if (!task) return null
  const contacts = getContactsByIds(task.contactIds)

  return (
    <Modal open={!!task} onClose={onClose} title={task.companyName ? `${task.companyName} — ${task.title}` : task.title} widthClassName="max-w-xl">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <UrgencyBadge urgency={task.urgency} />
          {task.eventDate && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar size={13} />
              {new Date(task.eventDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</h4>
          <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700">{task.description}</p>
        </div>

        {contacts.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Contacts</h4>
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{c.role}</p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                    {c.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {c.email}
                      </span>
                    )}
                    {c.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {c.phone}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {task.attachments.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Attachments</h4>
            <div className="space-y-1.5">
              {task.attachments.map((a) => (
                <a
                  key={a.id}
                  href={a.url}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <FileText size={15} className="text-orange-500" />
                  {a.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
