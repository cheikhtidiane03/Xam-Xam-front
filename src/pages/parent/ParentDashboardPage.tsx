
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Baby, ChevronRight, UserMinus } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { RattacherEnfantModal } from '@/components/parent/RattacherEnfantModal'
import { useFetch } from '@/hooks/useFetch'
import { parentApi } from '@/api/parent'
import { notify } from '@/lib/notify'
import type { CompteEleveResponse } from '@/types/compte'

export function ParentDashboardPage() {
  const { donnees: enfants, chargement, recharger } = useFetch(() => parentApi.mesEnfants(), [])
  const [modalOuverte, setModalOuverte] = useState(false)
  const [enfantADetacher, setEnfantADetacher] = useState<CompteEleveResponse | null>(null)
  const [detachementEnCours, setDetachementEnCours] = useState(false)

  async function confirmerDetachement() {
    if (!enfantADetacher) return
    setDetachementEnCours(true)
    try {
      await parentApi.delierEnfant(enfantADetacher.id)
      notify.succes(`${enfantADetacher.prenom} has been unlinked from your account.`)
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setDetachementEnCours(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Children</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your children's actual thinking efforts, not just their grades.
          </p>
        </div>
        <Button onClick={() => setModalOuverte(true)} className="gap-1.5">
          <UserPlus className="h-4 w-4" /> Link a Child
        </Button>
      </div>

      {chargement && <FullPageSpinner />}

      {enfants && enfants.length === 0 && (
        <EmptyState
          icon={<Baby className="h-8 w-8" />}
          titre="No Children Linked"
          description="Ask your child for a linking code from their account to link them here."
          action={
            <Button size="sm" onClick={() => setModalOuverte(true)} className="gap-1.5">
              <UserPlus className="h-4 w-4" /> Link a Child
            </Button>
          }
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {enfants?.map((enfant) => (
          <Card key={enfant.id} className="group relative">
            <Link to={`/parent/enfants/${enfant.id}`}>
              <CardBody className="flex items-center justify-between gap-3 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    {enfant.prenom[0]}{enfant.nom[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {enfant.prenom} {enfant.nom}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Badge tone="neutral">{enfant.niveauScolaire.replace('_', ' ')}</Badge>
                      {!enfant.actif && <Badge tone="warning">Inactive</Badge>}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
              </CardBody>
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); setEnfantADetacher(enfant) }}
              title="Unlink this child"
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-500/10"
            >
              <UserMinus className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>

      <RattacherEnfantModal
        ouvert={modalOuverte}
        onFermer={() => setModalOuverte(false)}
        onRattache={() => recharger()}
      />

      <ConfirmDialog
        ouvert={enfantADetacher !== null}
        onFermer={() => setEnfantADetacher(null)}
        onConfirmer={confirmerDetachement}
        chargement={detachementEnCours}
        titre="Unlink this child?"
        description={
          enfantADetacher
            ? `You will no longer have access to ${enfantADetacher.prenom} ${enfantADetacher.nom}'s progress until they are linked again using a new code.`
            : ''
        }
        libelleBouton="Unlink"
      />
    </div>
  )
}
