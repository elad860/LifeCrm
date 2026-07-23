import type { Task } from '../../types'
import { StatusBadge, UrgencyBadge } from '../ui/Badge'
import { getContactsByIds } from '../../mockData'

const urgencyRank = { high: 0, medium: 1, low: 2 } as const

interface ListViewProps {
  tasks: Task[]
  onOpenTask: (task: Task) => void
}

export function ListView({ tasks, onOpenTask }: ListViewProps) {
  const sorted = [...tasks].sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
            <th className="px-4 py-3 font-medium">Urgency</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Contacts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((task) => {
            const contacts = getContactsByIds(task.contactIds)
            return (
              <tr
                key={task.id}
                onClick={() => onOpenTask(task)}
                className="cursor-pointer hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  {task.companyName && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">{task.companyName}</p>
                  )}
                  <p className="font-medium text-slate-800">{task.title}</p>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3">
                  <UrgencyBadge urgency={task.urgency} />
                </td>
                <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                  {task.eventDate
                    ? new Date(task.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '—'}
                </td>
                <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                  {contacts.map((c) => c.name).join(', ') || '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
