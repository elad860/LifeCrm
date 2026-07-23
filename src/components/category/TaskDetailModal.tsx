import { useEffect, useState } from 'react'
import { Mail, Phone, FileText, Calendar, Pencil, Trash2 } from 'lucide-react'
import type { Task, TaskStatus, Urgency } from '../../types'
import { Modal } from '../ui/Modal'
import { StatusBadge, UrgencyBadge } from '../ui/Badge'
import { useData } from '../../context/DataContext'

interface TaskDetailModalProps {
  task: Task | null
  categoryId?: string
  mode?: 'view' | 'create'
  onClose: () => void
  onSave?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

interface TaskFormState {
  title: string
  companyName: string
  status: TaskStatus
  urgency: Urgency
  eventDate: string
  description: string
}

function emptyForm(): TaskFormState {
  return { title: '', companyName: '', status: 'todo', urgency: 'medium', eventDate: '', description: '' }
}

function taskToForm(task: Task): TaskFormState {
  return {
    title: task.title,
    companyName: task.companyName ?? '',
    status: task.status,
    urgency: task.urgency,
    eventDate: task.eventDate ?? '',
    description: task.description,
  }
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400'

export function TaskDetailModal({ task, categoryId, mode = 'view', onClose, onSave, onDelete }: TaskDetailModalProps) {
  const { getContactsByIds } = useData()
  const isCreate = mode === 'create'
  const [editing, setEditing] = useState(isCreate)
  const [form, setForm] = useState<TaskFormState>(() => (task ? taskToForm(task) : emptyForm()))

  useEffect(() => {
    setForm(task ? taskToForm(task) : emptyForm())
    setEditing(isCreate)
  }, [task, isCreate])

  const open = isCreate || !!task
  if (!open) return null

  const contacts = task ? getContactsByIds(task.contactIds) : []

  function handleSave() {
    if (!form.title.trim()) return

    const saved: Task = {
      id: task?.id ?? `t-${Date.now()}`,
      categoryId: task?.categoryId ?? categoryId ?? '',
      title: form.title.trim(),
      companyName: form.companyName.trim() || undefined,
      status: form.status,
      urgency: form.urgency,
      eventDate: form.eventDate || undefined,
      description: form.description.trim(),
      contactIds: task?.contactIds ?? [],
      attachments: task?.attachments ?? [],
    }
    onSave?.(saved)
    if (isCreate) {
      onClose()
    } else {
      setEditing(false)
    }
  }

  function handleDelete() {
    if (task) onDelete?.(task.id)
    onClose()
  }

  const title = isCreate ? 'New Task' : task?.companyName ? `${task.companyName} — ${task.title}` : task?.title ?? ''

  return (
    <Modal open={open} onClose={onClose} title={title} widthClassName="max-w-xl">
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div>
            <label className={labelClass}>Company (optional)</label>
            <input
              className={inputClass}
              value={form.companyName}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
              placeholder="Company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Urgency</label>
              <select
                className={inputClass}
                value={form.urgency}
                onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value as Urgency }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.eventDate}
              onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Details..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {!isCreate ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => (isCreate ? onClose() : setEditing(false))}
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCreate ? 'Add Task' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        task && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
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
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>

            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</h4>
              <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700">
                {task.description || '—'}
              </p>
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
        )
      )}
    </Modal>
  )
}
