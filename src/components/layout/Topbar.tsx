
import { useState, useRef, useEffect } from 'react'
import { Menu, LogOut, ChevronDown, User as UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { authApi } from '@/api/auth'
import { notify } from '@/lib/notify'
import { LABEL_ROLE } from './navConfig'
import { cheminEspaceRole } from '@/routes/ProtectedRoute'

export function Topbar({ onOuvrirMenu }: { onOuvrirMenu: () => void }) {
  const { nom, prenom, role, emailVerifie, clearSession } = useAuth()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onClickDehors(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOuvert(false)
    }
    document.addEventListener('mousedown', onClickDehors)
    return () => document.removeEventListener('mousedown', onClickDehors)
  }, [])

  async function seDeconnecter() {
    try {
      await authApi.logout()
    } catch {
      // meme si la revocation cote serveur echoue, on nettoie la session locale
    } finally {
      clearSession()
      notify.info('See you soon!')
      navigate('/connexion')
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-white/10 dark:bg-ink-950/80 lg:px-6">
      <button
        onClick={onOuvrirMenu}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        {/* {!emailVerifie && (
          <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-400 sm:inline-block">
            Email not verified
          </span>
        )} */}

        <ThemeToggle />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOuvert((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
              {prenom?.[0]}
              {nom?.[0]}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {menuOuvert && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-ink-900">
              <div className="px-2.5 py-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {prenom} {nom}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {role && LABEL_ROLE[role]}
                </p>
              </div>
              <div className="my-1 h-px bg-slate-100 dark:bg-white/10" />
              {role && (
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                  onClick={() => { setMenuOuvert(false); navigate(`${cheminEspaceRole(role)}/profil`) }}
                >
                  <UserIcon className="h-4 w-4" /> My Profile
                </button>
              )}
              <button
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                onClick={seDeconnecter}
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
