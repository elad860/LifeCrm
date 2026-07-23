import type { Category, Contact, Task } from './types'

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const categories: Category[] = [
  { id: 'job-search', name: 'Job Search', color: '#f97316', tint: '#fff1e6', icon: 'Briefcase' },
  { id: 'miluim', name: 'Miluim (Reserves)', color: '#4d7c0f', tint: '#f1f8e2', icon: 'Shield' },
  { id: 'or-1900', name: 'Or 1900 (Partner)', color: '#ec4899', tint: '#fdeef6', icon: 'Heart' },
  { id: 'friends', name: 'Friends', color: '#3b82f6', tint: '#eaf2fe', icon: 'Users' },
  { id: 'web-projects', name: 'Personal Web Projects', color: '#8b5cf6', tint: '#f3eefe', icon: 'Code' },
  { id: 'marathon', name: 'Marathon Training', color: '#ef4444', tint: '#feecec', icon: 'Activity' },
  { id: 'avner-yona', name: 'Avner Yona (Coworker)', color: '#14b8a6', tint: '#e9fbf8', icon: 'Building2' },
  { id: 'tal-orev', name: 'Tal Orev Mentor Project', color: '#f59e0b', tint: '#fef6e4', icon: 'GraduationCap' },
  { id: 'non-profits', name: 'Non-profits', color: '#10b981', tint: '#e8faf3', icon: 'HeartHandshake' },
  { id: 'network-groups', name: 'Key Network Groups', color: '#6366f1', tint: '#edeefe', icon: 'Network' },
]

export const contacts: Contact[] = [
  { id: 'c-checkpoint-hr', name: 'Noa Regev', role: 'HR Recruiter', status: 'Active', email: 'noa.regev@checkpoint.com', phone: '054-1234567', taskIds: ['t-job-checkpoint'] },
  { id: 'c-wix-recruiter', name: 'Itai Ben-David', role: 'Talent Acquisition', status: 'Active', email: 'itai.bd@wix.com', phone: '052-2345678', taskIds: ['t-job-wix'] },
  { id: 'c-monday-recruiter', name: 'Shira Katz', role: 'Recruiter', status: 'Closed - Rejected', email: 'shira.katz@monday.com', taskIds: ['t-job-monday'] },
  { id: 'c-fiverr-hiring', name: 'Omer Levi', role: 'Hiring Manager', status: 'Active', email: 'omer.levi@fiverr.com', phone: '053-3456789', taskIds: ['t-job-fiverr'] },
  { id: 'c-or', name: 'Or', role: 'Partner', status: 'Active', phone: '050-1112233', taskIds: ['t-or-anniversary', 't-or-lease'] },
  { id: 'c-yossi', name: 'Yossi Mizrahi', role: 'Friend', status: 'Active', phone: '054-9988776', taskIds: ['t-friends-bbq'] },
  { id: 'c-dani', name: 'Dani Cohen', role: 'Friend', status: 'Active', phone: '050-5544332', taskIds: ['t-friends-coffee'] },
  { id: 'c-avner', name: 'Avner Yona', role: 'Coworker', status: 'Active', email: 'avner.yona@company.com', taskIds: ['t-avner-handoff'] },
  { id: 'c-tal', name: 'Tal Orev', role: 'Mentor', status: 'Active', email: 'tal.orev@mentors.org', taskIds: ['t-tal-session'] },
]

export const tasks: Task[] = [
  // Job Search
  {
    id: 't-job-checkpoint', categoryId: 'job-search', title: 'Backend Developer', companyName: 'Check Point',
    status: 'in_progress', urgency: 'high', eventDate: addDays(2),
    description: 'Technical interview scheduled. Reviewed system design notes. Second round after this.',
    contactIds: ['c-checkpoint-hr'],
    attachments: [{ id: 'a1', name: 'CV_v3_backend.pdf', url: '#', uploadedAt: addDays(-10) }],
  },
  {
    id: 't-job-wix', categoryId: 'job-search', title: 'Fullstack Engineer', companyName: 'Wix',
    status: 'todo', urgency: 'medium', eventDate: addDays(6),
    description: 'Applied via referral. Waiting on initial screening call.',
    contactIds: ['c-wix-recruiter'],
    attachments: [{ id: 'a2', name: 'CV_v2_fullstack.pdf', url: '#', uploadedAt: addDays(-20) }],
  },
  {
    id: 't-job-monday', categoryId: 'job-search', title: 'Product Engineer', companyName: 'Monday.com',
    status: 'done', urgency: 'low', eventDate: addDays(-14),
    description: 'Reached final round, ultimately rejected in favor of an internal candidate. Good feedback received.',
    contactIds: ['c-monday-recruiter'],
    attachments: [{ id: 'a3', name: 'CV_v3_backend.pdf', url: '#', uploadedAt: addDays(-25) }],
  },
  {
    id: 't-job-fiverr', categoryId: 'job-search', title: 'Senior Developer', companyName: 'Fiverr',
    status: 'in_progress', urgency: 'medium', eventDate: addDays(4),
    description: 'Take-home assignment submitted, awaiting review.',
    contactIds: ['c-fiverr-hiring'],
    attachments: [{ id: 'a4', name: 'CV_v3_backend.pdf', url: '#', uploadedAt: addDays(-10) }],
  },

  // Miluim
  {
    id: 't-miluim-prep', categoryId: 'miluim', title: 'Reserve duty prep - equipment check', status: 'todo', urgency: 'high',
    eventDate: addDays(3), description: 'Pack gear, confirm call-up dates with unit.', contactIds: [], attachments: [],
  },
  {
    id: 't-miluim-return', categoryId: 'miluim', title: 'Equipment return - Base 8210', status: 'done', urgency: 'low',
    eventDate: addDays(-8), description: 'Returned gear after last stint, confirmed release form signed.', contactIds: [], attachments: [],
  },

  // Or 1900
  {
    id: 't-or-anniversary', categoryId: 'or-1900', title: 'Anniversary dinner planning', status: 'todo', urgency: 'medium',
    eventDate: addDays(5), description: 'Book restaurant, arrange surprise.', contactIds: ['c-or'], attachments: [],
  },
  {
    id: 't-or-lease', categoryId: 'or-1900', title: 'Apartment lease renewal discussion', status: 'in_progress', urgency: 'medium',
    eventDate: addDays(1), description: 'Compare renewal terms vs. moving options together.', contactIds: ['c-or'], attachments: [],
  },

  // Friends
  {
    id: 't-friends-bbq', categoryId: 'friends', title: "Yossi's birthday BBQ", status: 'todo', urgency: 'low',
    eventDate: addDays(4), description: 'Bring drinks, confirm headcount.', contactIds: ['c-yossi'], attachments: [],
  },
  {
    id: 't-friends-coffee', categoryId: 'friends', title: 'Coffee catch-up with Dani', status: 'done', urgency: 'low',
    eventDate: addDays(-2), description: 'Caught up after his move, good to reconnect.', contactIds: ['c-dani'], attachments: [],
  },

  // Web Projects
  {
    id: 't-web-lifecrm', categoryId: 'web-projects', title: 'Life CRM App', status: 'in_progress', urgency: 'high',
    eventDate: addDays(0), description: 'Building the UI shell with dummy data before wiring up Supabase.', contactIds: [], attachments: [],
  },
  {
    id: 't-web-portfolio', categoryId: 'web-projects', title: 'Portfolio site redesign', status: 'todo', urgency: 'low',
    eventDate: addDays(20), description: 'Refresh case studies, add dark hero section.', contactIds: [], attachments: [],
  },

  // Marathon
  {
    id: 't-marathon-longrun', categoryId: 'marathon', title: 'Long run - 32km', status: 'todo', urgency: 'medium',
    eventDate: addDays(3), description: 'Fuel with gels every 8km, target pace 5:40/km.', contactIds: [], attachments: [],
  },
  {
    id: 't-marathon-race', categoryId: 'marathon', title: 'Tel Aviv Marathon - race day', status: 'todo', urgency: 'high',
    eventDate: addDays(45), description: 'Goal: sub-3:45. Taper starts two weeks out.', contactIds: [], attachments: [],
  },
  {
    id: 't-marathon-physio', categoryId: 'marathon', title: 'Physio appointment - knee', status: 'done', urgency: 'low',
    eventDate: addDays(-5), description: 'Cleared to keep training, given mobility exercises.', contactIds: [], attachments: [],
  },

  // Avner Yona
  {
    id: 't-avner-handoff', categoryId: 'avner-yona', title: 'Handoff docs for API migration', status: 'in_progress', urgency: 'medium',
    eventDate: addDays(2), description: 'Document auth flow before Avner takes over the service.', contactIds: ['c-avner'], attachments: [],
  },

  // Tal Orev
  {
    id: 't-tal-session', categoryId: 'tal-orev', title: 'Mentoring session prep', status: 'todo', urgency: 'medium',
    eventDate: addDays(7), description: 'Prepare questions on career direction and negotiation.', contactIds: ['c-tal'], attachments: [],
  },

  // Non-profits
  {
    id: 't-nonprofit-orientation', categoryId: 'non-profits', title: 'Volunteer orientation - Latet', status: 'todo', urgency: 'low',
    eventDate: addDays(9), description: 'New volunteer orientation session.', contactIds: [], attachments: [],
  },
  {
    id: 't-nonprofit-fooddrive', categoryId: 'non-profits', title: 'Food drive coordination', status: 'in_progress', urgency: 'medium',
    eventDate: addDays(6), description: 'Coordinate pickup locations with 3 volunteers.', contactIds: [], attachments: [],
  },

  // Network Groups
  {
    id: 't-network-meetup', categoryId: 'network-groups', title: 'Monthly meetup - Tech Leaders Israel', status: 'todo', urgency: 'low',
    eventDate: addDays(8), description: 'RSVP and prepare a couple of talking points.', contactIds: [], attachments: [],
  },
  {
    id: 't-network-followup', categoryId: 'network-groups', title: 'Follow up intros from last meetup', status: 'in_progress', urgency: 'medium',
    eventDate: addDays(1), description: 'Send LinkedIn connections and a short thank-you note.', contactIds: [], attachments: [],
  },
]

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getTasksByCategory(categoryId: string): Task[] {
  return tasks.filter((t) => t.categoryId === categoryId)
}

export function getContactsByIds(ids: string[]): Contact[] {
  return contacts.filter((c) => ids.includes(c.id))
}
