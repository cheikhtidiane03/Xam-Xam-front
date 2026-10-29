
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { GraduationCap } from 'lucide-react'
import { NAV_PAR_ROLE, LABEL_ROLE } from './navConfig'
import type { Role } from '@/types/auth'

interface SidebarProps {
  role: Role
  ouverte: boolean
  onFermer: () => void
}

export function Sidebar({ role, ouverte, onFermer }: SidebarProps) {
  const items = NAV_PAR_ROLE[role]

  return (
    <>
      {/* Overlay mobile */}
      {ouverte && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onFermer} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-200 bg-white transition-transform',
          'dark:border-white/10 dark:bg-ink-900',
          'lg:static lg:translate-x-0',
          ouverte ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5 dark:border-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 dark:bg-brand-500">
            <GraduationCap className="h-4.5 w-4.5 text-brand-400 dark:text-ink-950" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Xaam-Xaam+</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{LABEL_ROLE[role]}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role.toLowerCase().replace('_', '-')}`}
              onClick={onFermer}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
