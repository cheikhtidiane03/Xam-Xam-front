import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/Button'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-ink-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 dark:bg-brand-500">
            <GraduationCap className="h-4.5 w-4.5 text-brand-400 dark:text-ink-950" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Xaam-Xaam+</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/connexion">
            <Button variant="ghost" size="sm">Se connecter</Button>
          </Link>
          <Link to="/inscription">
            <Button variant="primary" size="sm">Créer un compte</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-ink-900 dark:bg-brand-500">
            <GraduationCap className="h-3.5 w-3.5 text-brand-400 dark:text-ink-950" />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Xaam-Xaam+</span>
        </div>
        <p className="max-w-md text-xs text-slate-500 dark:text-slate-400">
          Accompagnement scolaire par IA guidée. L'IA pose des questions, jamais des réponses toutes faites.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Xaam-Xaam+ — Dakar, Sénégal
        </p>
      </div>
    </footer>
  )
}
