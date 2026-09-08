import { useState } from 'react'
import { ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'
import { notify } from '@/lib/notify'

const LABEL_TYPE: Record<string, string> = {
  COPIE_ENONCE: "Copie de l'énoncé",
  REPONSE_ANORMALEMENT_LONGUE: 'Réponse anormalement longue',
  RAPIDITE_SUSPECTE: 'Rapidité suspecte',
}

export function SuperadminSignalementsPage() {
  const { donnees: signalements, chargement, recharger } = useFetch(
    () => superadminApi.signalementsNonTraites(),
    []
  )
  const [actionEnCours, setActionEnCours] = useState<string | null>(null)

  async function traiter(id: string) {
    setActionEnCours(id)
    try {
      await superadminApi.traiterSignalement(id)
      notify.succes('Signalement marqué comme traité.')
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Signalements de contournement</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Générés automatiquement (copie d'énoncé, réponse suspecte...). Ne bloquent jamais l'élève : à toi de juger.
        </p>
      </div>

      {chargement && <FullPageSpinner />}

      {signalements && signalements.length === 0 && (
        <EmptyState
          icon={<ShieldAlert className="h-8 w-8" />}
          titre="Aucun signalement en attente"
          description="Tout est calme pour le moment."
        />
      )}

      <div className="flex flex-col gap-3">
        {signalements?.map((s) => (
          <Card key={s.id}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="warning">{LABEL_TYPE[s.type] ?? s.type}</Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(s.dateCreation).toLocaleString('fr-FR')}
                  </span>
                </div>
                <p className="mt-1.5 font-medium text-slate-800 dark:text-slate-200">{s.eleveNomComplet}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{s.details}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                loading={actionEnCours === s.id}
                onClick={() => traiter(s.id)}
                className="gap-1.5 shrink-0"
              >
                <CheckCircle2 className="h-4 w-4" /> Marquer traité
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
