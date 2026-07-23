import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Kanban, List as ListIcon } from 'lucide-react'
import { getCategory, getTasksByCategory } from '../mockData'
import { getCategoryIcon } from '../lib/icons'
import { KanbanBoard } from '../components/category/KanbanBoard'
import { ListView } from '../components/category/ListView'
import { TaskDetailModal } from '../components/category/TaskDetailModal'
import type { Task, TaskStatus } from '../types'

type ViewMode = 'kanban' | 'list'

export function CategoryView() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = categoryId ? getCategory(categoryId) : undefined

  const [tasks, setTasks] = useState<Task[]>(() => (categoryId ? getTasksByCategory(categoryId) : []))
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const Icon = category ? getCategoryIcon(category.icon) : null

  const counts = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }),
    [tasks],
  )

  if (!category) return <Navigate to="/" replace />

  function handleStatusChange(taskId: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)))
  }

  return (
    <div>
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: category.tint, color: category.color }}
          >
            {Icon && <Icon size={22} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{category.name}</h1>
            <p className="text-sm text-slate-500">
              {counts.todo} To Do · {counts.inProgress} In Progress · {counts.done} Done
            </p>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'kanban' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Kanban size={15} />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
            }`}
          >
            <ListIcon size={15} />
            List
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} onOpenTask={setSelectedTask} />
      ) : (
        <ListView tasks={tasks} onOpenTask={setSelectedTask} />
      )}

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  )
}
