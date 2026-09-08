import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { authApi } from '@/api/auth'
import { messageErreur } from '@/hooks/useApiError'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [statut, setStatut] = useState<'chargement' | 'succes' | 'erreur'>('chargement')
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStatut('erreur')
      setErreur('Aucun token fourni dans le lien.')
      return
    }
    authApi
      .verifierEmail({ token })
      .then(() => setStatut('succes'))
      .catch((err) => {
        setStatut('erreur')
        setErreur(messageErreur(err))
      })
  }, [token])

  return (
    <AuthLayout titre="Vérification de l'email">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        {statut === 'chargement' && <Loader2 className="h-10 w-10 animate-spin text-slate-400" />}
        {statut === 'succes' && (
          <>
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Ton email est confirmé !</p>
          </>
        )}
        {statut === 'erreur' && (
          <>
            <XCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">{erreur}</p>
          </>
        )}
        <Link to="/connexion" className="mt-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          Retour à la connexion
        </Link>
      </div>
    </AuthLayout>
  )
}
