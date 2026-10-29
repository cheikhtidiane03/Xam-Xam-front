
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
  COPIE_ENONCE: 'Copied Exercise Instructions',
  REPONSE_ANORMALEMENT_LONGUE: 'Unusually Long Answer',
  RAPIDITE_SUSPECTE: 'Suspiciously Fast Response',
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
      notify.succes('Report marked as reviewed.')
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Potential Misconduct Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Automatically generated reports (copied exercise instructions, suspicious answers, etc.). Students are never blocked: you decide how to handle each case.
        </p>
      </div>

      {chargement && <FullPageSpinner />}

      {signalements && signalements.length === 0 && (
        <EmptyState
          icon={<ShieldAlert className="h-8 w-8" />}
          titre="No Pending Reports"
          description="Everything is quiet for now."
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
                <CheckCircle2 className="h-4 w-4" /> Mark as Reviewed
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
