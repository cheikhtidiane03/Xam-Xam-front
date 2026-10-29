
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/api/auth'
import { messageErreur } from '@/hooks/useApiError'
import { notify } from '@/lib/notify'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const tokenInitial = searchParams.get('token') ?? ''

  const [token, setToken] = useState(tokenInitial)
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErreur(null)
    setChargement(true)
    try {
      await authApi.reinitialiserMotDePasse({ token, nouveauMotDePasse })
      notify.succes('Password updated. You can now log in.')
      navigate('/connexion', { replace: true })
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setChargement(false)
    }
  }

  return (
    <AuthLayout titre="Choose a New Password">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Password Reset Token"
          hint="Copied from the link you received by email"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Input
          label="New Password"
          type="password"
          required
          minLength={8}
          hint="Minimum 8 characters"
          value={nouveauMotDePasse}
          onChange={(e) => setNouveauMotDePasse(e.target.value)}
        />
        {erreur && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {erreur}
          </p>
        )}
        <Button type="submit" loading={chargement} className="w-full">
          Update Password
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/connexion" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  )
}
