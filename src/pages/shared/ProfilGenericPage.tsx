
import { UserCircle } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { LABEL_ROLE } from '@/components/layout/navConfig'

/**
 * Page profil partagee par les roles Parent, Enseignant, Admin etablissement
 * et Superadmin : ces comptes n'ont pas de fonctionnalites specifiques de
 * profil comme l'eleve (pas de droit a l'oubli en libre-service pour des
 * comptes institutionnels, pas de code de liaison...). Affiche uniquement
 * les informations de base. L'eleve garde sa propre page dediee
 * (EleveProfilPage) avec export/suppression/code de liaison.
 */
export function ProfilGenericPage() {
  const { nom, prenom, email, role, emailVerifie } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Your account information.</p>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{prenom} {nom}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{role && LABEL_ROLE[role]}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Email</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 dark:text-slate-400">Email Verified</span>
              <span className={emailVerifie ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'font-medium text-amber-600 dark:text-amber-400'}>
                {emailVerifie ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        To update your information or delete your account, contact a Xaam-Xaam+ administrator.
      </p>
    </div>
  )
}
