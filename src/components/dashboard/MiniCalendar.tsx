import { useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { Card } from '../ui/Card'
import { getCategory, tasks } from '../../mockData'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function MiniCalendar() {
  const [expanded, setExpanded] = useState(true)
  const [monthOffset, setMonthOffset] = useState(0)

  const today = useMemo(() => new Date(), [])
  const todayKey = toDateKey(today)

  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const tasksByDate = useMemo(() => {
    const map = new Map<string, { color: string }[]>()
    for (const task of tasks) {
      if (!task.eventDate) continue
      const cat = getCategory(task.categoryId)
      if (!cat) continue
      const list = map.get(task.eventDate) ?? []
      list.push({ color: cat.color })
      map.set(task.eventDate, list)
    }
    return map
  }, [])

  const gridDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    return days
  }, [viewDate])

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => t.eventDate && t.eventDate >= todayKey && t.status !== 'done')
        .sort((a, b) => (a.eventDate! < b.eventDate! ? -1 : 1))
        .slice(0, 5),
    [todayKey],
  )

  return (
    <Card className="p-5">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-violet-500" />
          <h3 className="text-base font-semibold text-slate-900">Upcoming</h3>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonthOffset((m) => m - 1)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-slate-700">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setMonthOffset((m) => m + 1)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={i} className="text-[11px] font-medium text-slate-400">
                {label}
              </span>
            ))}
            {gridDays.map((day, i) => {
              if (!day) return <span key={i} />
              const key = toDateKey(day)
              const dots = tasksByDate.get(key) ?? []
              const isToday = key === todayKey
              return (
                <div key={i} className="flex flex-col items-center gap-0.5 py-1">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday ? 'bg-slate-900 font-semibold text-white' : 'text-slate-600'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <div className="flex h-1.5 gap-0.5">
                    {dots.slice(0, 3).map((dot, di) => (
                      <span key={di} className="h-1 w-1 rounded-full" style={{ backgroundColor: dot.color }} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            {upcoming.length === 0 && <p className="text-sm text-slate-400">Nothing coming up.</p>}
            {upcoming.map((task) => {
              const cat = getCategory(task.categoryId)
              return (
                <div key={task.id} className="flex items-center gap-2.5 text-sm">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cat?.color }} />
                  <span className="w-14 shrink-0 text-xs text-slate-400">
                    {new Date(task.eventDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="truncate text-slate-700">{task.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
