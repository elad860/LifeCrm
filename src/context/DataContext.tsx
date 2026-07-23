import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Attachment, Category, Contact, Task, TaskStatus } from '../types'

interface DataContextValue {
  categories: Category[]
  contacts: Contact[]
  tasks: Task[]
  loading: boolean
  error: string | null
  getCategory: (id: string) => Category | undefined
  getTasksByCategory: (categoryId: string) => Task[]
  getContactsByIds: (ids: string[]) => Contact[]
  createTask: (task: Task) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

type CategoryRow = { id: string; name: string; color: string; tint: string; icon: string }
type ContactRow = { id: string; name: string; role: string; status: string; email: string | null; phone: string | null }
type TaskRow = {
  id: string
  category_id: string
  title: string
  company_name: string | null
  status: TaskStatus
  urgency: Task['urgency']
  event_date: string | null
  description: string
}
type TaskContactRow = { task_id: string; contact_id: string }
type AttachmentRow = { id: string; task_id: string; name: string; url: string; uploaded_at: string }

function taskToRow(task: Task) {
  return {
    title: task.title,
    company_name: task.companyName ?? null,
    status: task.status,
    urgency: task.urgency,
    event_date: task.eventDate ?? null,
    description: task.description,
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const [categoriesRes, contactsRes, tasksRes, taskContactsRes, attachmentsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('contacts').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('task_contacts').select('*'),
        supabase.from('attachments').select('*'),
      ])
      if (cancelled) return

      const firstError =
        categoriesRes.error ?? contactsRes.error ?? tasksRes.error ?? taskContactsRes.error ?? attachmentsRes.error
      if (firstError) {
        setError(firstError.message)
        setLoading(false)
        return
      }

      const contactIdsByTask = new Map<string, string[]>()
      const taskIdsByContact = new Map<string, string[]>()
      for (const link of (taskContactsRes.data as TaskContactRow[]) ?? []) {
        contactIdsByTask.set(link.task_id, [...(contactIdsByTask.get(link.task_id) ?? []), link.contact_id])
        taskIdsByContact.set(link.contact_id, [...(taskIdsByContact.get(link.contact_id) ?? []), link.task_id])
      }

      const attachmentsByTask = new Map<string, Attachment[]>()
      for (const a of (attachmentsRes.data as AttachmentRow[]) ?? []) {
        const attachment: Attachment = { id: a.id, name: a.name, url: a.url, uploadedAt: a.uploaded_at }
        attachmentsByTask.set(a.task_id, [...(attachmentsByTask.get(a.task_id) ?? []), attachment])
      }

      setCategories(
        ((categoriesRes.data as CategoryRow[]) ?? []).map((c) => ({
          id: c.id,
          name: c.name,
          color: c.color,
          tint: c.tint,
          icon: c.icon,
        })),
      )
      setContacts(
        ((contactsRes.data as ContactRow[]) ?? []).map((c) => ({
          id: c.id,
          name: c.name,
          role: c.role,
          status: c.status,
          email: c.email ?? undefined,
          phone: c.phone ?? undefined,
          taskIds: taskIdsByContact.get(c.id) ?? [],
        })),
      )
      setTasks(
        ((tasksRes.data as TaskRow[]) ?? []).map((t) => ({
          id: t.id,
          categoryId: t.category_id,
          title: t.title,
          companyName: t.company_name ?? undefined,
          status: t.status,
          urgency: t.urgency,
          eventDate: t.event_date ?? undefined,
          description: t.description,
          contactIds: contactIdsByTask.get(t.id) ?? [],
          attachments: attachmentsByTask.get(t.id) ?? [],
        })),
      )
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const getCategory = useCallback((id: string) => categories.find((c) => c.id === id), [categories])
  const getTasksByCategory = useCallback(
    (categoryId: string) => tasks.filter((t) => t.categoryId === categoryId),
    [tasks],
  )
  const getContactsByIds = useCallback((ids: string[]) => contacts.filter((c) => ids.includes(c.id)), [contacts])

  const createTask = useCallback(async (task: Task) => {
    setTasks((prev) => [...prev, task])
    const { error: insertError } = await supabase.from('tasks').insert({ id: task.id, category_id: task.categoryId, ...taskToRow(task) })
    if (insertError) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
      setError(insertError.message)
    }
  }, [])

  const updateTask = useCallback(async (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    const { error: updateError } = await supabase.from('tasks').update(taskToRow(task)).eq('id', task.id)
    if (updateError) setError(updateError.message)
  }, [])

  const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)))
    const { error: updateError } = await supabase.from('tasks').update({ status }).eq('id', taskId)
    if (updateError) setError(updateError.message)
  }, [])

  const deleteTask = useCallback(async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    const { error: deleteError } = await supabase.from('tasks').delete().eq('id', taskId)
    if (deleteError) setError(deleteError.message)
  }, [])

  const value = useMemo<DataContextValue>(
    () => ({
      categories,
      contacts,
      tasks,
      loading,
      error,
      getCategory,
      getTasksByCategory,
      getContactsByIds,
      createTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
    }),
    [
      categories,
      contacts,
      tasks,
      loading,
      error,
      getCategory,
      getTasksByCategory,
      getContactsByIds,
      createTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}
