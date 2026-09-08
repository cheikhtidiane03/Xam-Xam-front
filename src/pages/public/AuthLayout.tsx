import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export function AuthLayout({
  titre,
  sousTitre,
  children,
}: {
  titre: string
  sousTitre?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-ink-950">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 dark:bg-brand-500">
            <GraduationCap className="h-5 w-5 text-brand-400 dark:text-ink-950" />
          </div>
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Xaam-Xaam+</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-ink-900 sm:p-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{titre}</h1>
          {sousTitre && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sousTitre}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
