import { useState } from 'react'
import { UserCog, CheckCircle2, Ban } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'
import { notify } from '@/lib/notify'
import type { UtilisateurAdmin } from '@/types/compte'

const LABEL_ROLE: Record<string, string> = {
  ELEVE: 'Élève',
  PARENT: 'Parent',
  ENSEIGNANT: 'Enseignant',
  ADMIN_ETABLISSEMENT: "Admin d'établissement",
  SUPERADMIN: 'Superadmin',
}

export function SuperadminComptesPage() {
  const { donnees: comptes, chargement, recharger } = useFetch(() => superadminApi.comptesEnAttente(), [])
  const [actionEnCours, setActionEnCours] = useState<string | null>(null)
  const [compteASuspendre, setCompteASuspendre] = useState<UtilisateurAdmin | null>(null)

  async function valider(id: string) {
    setActionEnCours(id)
    try {
      await superadminApi.validerCompte(id)
      notify.succes('Compte validé.')
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setActionEnCours(null)
    }
  }

  async function confirmerSuspension() {
    if (!compteASuspendre) return
    setActionEnCours(compteASuspendre.id)
    try {
      await superadminApi.suspendreCompte(compteASuspendre.id)
      notify.succes('Compte suspendu.')
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setActionEnCours(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Comptes en attente</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Valide les comptes Enseignant et Administrateur d'établissement avant qu'ils puissent se connecter.
        </p>
      </div>

      {chargement && <FullPageSpinner />}

      {comptes && comptes.length === 0 && (
        <EmptyState icon={<UserCog className="h-8 w-8" />} titre="Aucun compte en attente" />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {comptes?.map((c) => (
          <Card key={c.id}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{c.prenom} {c.nom}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.email}</p>
                <Badge tone="brand" className="mt-1.5">{LABEL_ROLE[c.role] ?? c.role}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  loading={actionEnCours === c.id}
                  onClick={() => valider(c.id)}
                  className="gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Valider
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCompteASuspendre(c)}
                  className="gap-1 text-red-600 dark:text-red-400"
                >
                  <Ban className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        ouvert={compteASuspendre !== null}
        onFermer={() => setCompteASuspendre(null)}
        onConfirmer={confirmerSuspension}
        chargement={actionEnCours === compteASuspendre?.id}
        titre="Suspendre ce compte ?"
        description={
          compteASuspendre
            ? `${compteASuspendre.prenom} ${compteASuspendre.nom} (${compteASuspendre.email}) ne pourra plus se connecter tant que le compte n'est pas réactivé.`
            : ''
        }
        libelleBouton="Suspendre"
      />
    </div>
  )
}
