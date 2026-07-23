export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type Urgency = 'low' | 'medium' | 'high'

export interface Category {
  id: string
  name: string
  color: string // hex, used for accents/badges
  tint: string // pale hex tint of the same color, used for backgrounds
  icon: string // lucide-react icon name
}

export interface Attachment {
  id: string
  name: string
  url: string
  uploadedAt: string // ISO date
}

export interface Contact {
  id: string
  name: string
  role: string
  status: string
  email?: string
  phone?: string
  taskIds: string[]
}

export interface Task {
  id: string
  categoryId: string
  title: string
  status: TaskStatus
  urgency: Urgency
  eventDate?: string // ISO date, past or future
  description: string
  contactIds: string[]
  attachments: Attachment[]
  companyName?: string // Job Search convenience field
}
