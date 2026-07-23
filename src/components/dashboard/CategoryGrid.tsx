import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { categories, getTasksByCategory } from '../../mockData'
import { getCategoryIcon } from '../../lib/icons'
import { Card } from '../ui/Card'

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const categoryTasks = getTasksByCategory(category.id)
        const todo = categoryTasks.filter((t) => t.status === 'todo').length
        const inProgress = categoryTasks.filter((t) => t.status === 'in_progress').length
        const done = categoryTasks.filter((t) => t.status === 'done').length
        const Icon = getCategoryIcon(category.icon)

        return (
          <Link key={category.id} to={`/category/${category.id}`}>
            <Card className="group h-full p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: category.tint, color: category.color }}
                >
                  <Icon size={22} />
                </div>
                <ChevronRight
                  size={18}
                  className="mt-2 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400"
                />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">{category.name}</h3>

              <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-medium">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{todo} To Do</span>
                <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700">{inProgress} In Progress</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">{done} Done</span>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
