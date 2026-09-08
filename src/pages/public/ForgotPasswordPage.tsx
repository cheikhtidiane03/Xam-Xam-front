import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/api/auth'
import { messageErreur } from '@/hooks/useApiError'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErreur(null)
    setChargement(true)
    try {
      await authApi.motDePasseOublie({ email })
      setEnvoye(true)
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setChargement(false)
    }
  }

  if (envoye) {
    return (
      <AuthLayout titre="Vérifie ta boîte mail">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Si un compte existe avec l'adresse <strong>{email}</strong>, un email vient de t'être envoyé
            avec un lien de réinitialisation.
          </p>
          <Link to="/connexion" className="mt-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
            Retour à la connexion
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout titre="Mot de passe oublié" sousTitre="On t'envoie un lien de réinitialisation par email">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {erreur && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {erreur}
          </p>
        )}
        <Button type="submit" loading={chargement} className="w-full">
          Envoyer le lien
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/connexion" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Retour à la connexion
        </Link>
      </p>
    </AuthLayout>
  )
}
