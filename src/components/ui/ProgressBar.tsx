import { clsx } from 'clsx'

export function ProgressBar({ valeur, className }: { valeur: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, valeur))
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10', className)}>
      <div
        className="h-full rounded-full bg-brand-500 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
