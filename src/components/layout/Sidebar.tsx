import { NavLink } from 'react-router-dom'
import { LayoutGrid, Sparkles } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { getCategoryIcon } from '../../lib/icons'

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { categories } = useData()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
          <Sparkles size={18} />
        </div>
        <span className="text-lg font-bold text-slate-900">Life CRM</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <LayoutGrid size={18} />
          Dashboard
        </NavLink>

        <div className="mt-5 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Categories
        </div>

        {categories.map((category) => {
          const Icon = getCategoryIcon(category.icon)
          return (
            <NavLink
              key={category.id}
              to={`/category/${category.id}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
              style={({ isActive }) => (isActive ? { backgroundColor: category.color } : undefined)}
            >
              <Icon size={18} style={{ color: undefined }} />
              <span className="truncate">{category.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-100 bg-white lg:block">
      <SidebarContent />
    </aside>
  )
}
