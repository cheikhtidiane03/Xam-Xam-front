
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/api/auth'
import { useAuth } from '@/hooks/useAuth'
import { messageErreur } from '@/hooks/useApiError'
import { notify } from '@/lib/notify'
import { cheminEspaceRole } from '@/routes/ProtectedRoute'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)

  const { setSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErreur(null)
    setChargement(true)
    try {
      const auth = await authApi.login({ email, motDePasse })
      setSession(auth)
      notify.succes(`Welcome back, ${auth.prenom}!`)
      const destination = (location.state as { from?: Location })?.from?.pathname ?? cheminEspaceRole(auth.role)
      navigate(destination, { replace: true })
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setChargement(false)
    }
  }

  return (
    <AuthLayout titre="Log In" sousTitre="Welcome back to Xaam-Xaam+">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {erreur && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {erreur}
          </p>
        )}

        <div className="flex items-center justify-end">
          <Link to="/mot-de-passe-oublie" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={chargement} className="w-full">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account yet?{' '}
        <Link to="/inscription" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  )
}
