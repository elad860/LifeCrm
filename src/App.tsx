import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { CategoryView } from './pages/CategoryView'
import { DataProvider, useData } from './context/DataContext'

function AppRoutes() {
  const { loading, error } = useData()

  if (loading) {
    return <div className="flex min-h-svh items-center justify-center text-sm text-slate-400">Loading…</div>
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4 text-center text-sm text-rose-500">
        Failed to load data: {error}
      </div>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category/:categoryId" element={<CategoryView />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </BrowserRouter>
  )
}

export default App
