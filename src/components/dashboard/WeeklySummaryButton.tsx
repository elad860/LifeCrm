import { useMemo, useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { StatusBadge, UrgencyBadge } from '../ui/Badge'
import { categories, getTasksByCategory } from '../../mockData'

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeek(date: Date): Date {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 6)
  return d
}

export function WeeklySummaryButton() {
  const [open, setOpen] = useState(false)

  const { weekStart, weekEnd } = useMemo(() => {
    const today = new Date()
    return { weekStart: startOfWeek(today), weekEnd: endOfWeek(today) }
  }, [])

  const weekStartKey = weekStart.toISOString().slice(0, 10)
  const weekEndKey = weekEnd.toISOString().slice(0, 10)

  const groups = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          tasks: getTasksByCategory(category.id)
            .filter((t) => t.eventDate && t.eventDate >= weekStartKey && t.eventDate <= weekEndKey)
            .sort((a, b) => (a.eventDate! < b.eventDate! ? -1 : 1)),
        }))
        .filter((g) => g.tasks.length > 0),
    [weekStartKey, weekEndKey],
  )

  const rangeLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
      >
        <CalendarRange size={17} />
        Weekly Summary
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={`This Week (${rangeLabel})`} widthClassName="max-w-2xl">
        <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
          {groups.length === 0 && <p className="text-sm text-slate-400">Nothing scheduled this week.</p>}
          {groups.map(({ category, tasks }) => (
            <div key={category.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                <h3 className="text-sm font-semibold text-slate-800">{category.name}</h3>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{task.title}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(task.eventDate!).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <StatusBadge status={task.status} />
                      <UrgencyBadge urgency={task.urgency} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
