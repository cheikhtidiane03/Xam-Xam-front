import { type ReactNode } from 'react'
import { clsx } from 'clsx'

interface EmptyStateProps {
  icon?: ReactNode
  titre: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, titre, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-white/10',
        className
      )}
    >
      {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      <div>
        <p className="font-medium text-slate-700 dark:text-slate-200">{titre}</p>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}
