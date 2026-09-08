import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuth } from '@/hooks/useAuth'

export function AppShell() {
  const { role } = useAuth()
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false)

  if (!role) return null

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-ink-950">
      <Sidebar role={role} ouverte={menuMobileOuvert} onFermer={() => setMenuMobileOuvert(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Topbar onOuvrirMenu={() => setMenuMobileOuvert(true)} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
