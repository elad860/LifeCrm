import { CategoryGrid } from '../components/dashboard/CategoryGrid'
import { MiniCalendar } from '../components/dashboard/MiniCalendar'
import { WeeklySummaryButton } from '../components/dashboard/WeeklySummaryButton'
import { NotificationsCard } from '../components/dashboard/NotificationsCard'

export function Dashboard() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Everything going on across your life, in one place.</p>
        </div>
        <WeeklySummaryButton />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CategoryGrid />
        </div>
        <div className="space-y-6">
          <MiniCalendar />
          <NotificationsCard />
        </div>
      </div>
    </div>
  )
}
