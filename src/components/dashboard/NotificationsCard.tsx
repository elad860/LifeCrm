import { Mail, Bell } from 'lucide-react'
import { Card } from '../ui/Card'

interface MockNotification {
  id: string
  company: string
  snippet: string
  timeAgo: string
}

const mockNotifications: MockNotification[] = [
  {
    id: 'n1',
    company: 'Check Point',
    snippet: 'Received an email regarding next steps in the interview process.',
    timeAgo: '2h ago',
  },
  {
    id: 'n2',
    company: 'Wix',
    snippet: 'Recruiter replied about scheduling an initial screening call.',
    timeAgo: '1d ago',
  },
  {
    id: 'n3',
    company: 'Fiverr',
    snippet: 'Confirmation that your take-home assignment was received.',
    timeAgo: '3d ago',
  },
]

export function NotificationsCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Bell size={18} className="text-amber-500" />
        <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Placeholder alerts — this card will surface real Gmail matches once the integration is connected.
      </p>

      <div className="mt-4 space-y-3">
        {mockNotifications.map((n) => (
          <div key={n.id} className="flex gap-3 rounded-xl bg-orange-50 p-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Mail size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-800">
                <span className="font-semibold">{n.company}</span> — {n.snippet}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{n.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
