import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'brand'

const TONE_STYLES: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONE_STYLES[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
