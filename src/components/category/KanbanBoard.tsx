import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core'
import type { Task, TaskStatus } from '../../types'
import { TaskCard } from './TaskCard'

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

interface KanbanBoardProps {
  tasks: Task[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onOpenTask: (task: Task) => void
}

function DraggableTask({ task, onOpenTask }: { task: Task; onOpenTask: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard task={task} onOpen={onOpenTask} isDragging={isDragging} dragHandleProps={{ ...listeners, ...attributes }} />
    </div>
  )
}

function Column({
  id,
  label,
  tasks,
  onOpenTask,
}: {
  id: TaskStatus
  label: string
  tasks: Task[]
  onOpenTask: (task: Task) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[240px] w-full flex-col rounded-2xl p-3 transition-colors ${
        isOver ? 'bg-violet-50' : 'bg-slate-100/70'
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-600">{label}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-400 shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <DraggableTask key={task.id} task={task} onOpenTask={onOpenTask} />
        ))}
      </div>
    </div>
  )
}

export function KanbanBoard({ tasks, onStatusChange, onOpenTask }: KanbanBoardProps) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as TaskStatus
    onStatusChange(active.id as string, newStatus)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            tasks={tasks.filter((t) => t.status === col.id)}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
    </DndContext>
  )
}
