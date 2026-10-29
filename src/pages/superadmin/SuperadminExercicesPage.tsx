
import { useSearchParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'

export function SuperadminExercicesPage() {
  const [params, setParams] = useSearchParams()
  const aujourdhui = params.get('periode') === 'aujourdhui'

  const { donnees: exercices, chargement } = useFetch(
    () => superadminApi.listerExercices({ periode: aujourdhui ? 'aujourdhui' : undefined }),
    [aujourdhui]
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Exercises</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {aujourdhui ? "Exercises started today." : 'All exercises started on the platform.'}
        </p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={aujourdhui ? undefined : 'outline'} onClick={() => setParams({ periode: 'aujourdhui' })}>
          Today
        </Button>
        <Button size="sm" variant={aujourdhui ? 'outline' : undefined} onClick={() => setParams({})}>
          All
        </Button>
      </div>

      {chargement && <FullPageSpinner />}

      {exercices && exercices.length === 0 && (
        <EmptyState icon={<BookOpen className="h-8 w-8" />} titre="No Exercises for This Period" />
      )}

      <div className="flex flex-col gap-3">
        {exercices?.map((x) => (
          <Card key={x.id}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {x.matiere && <Badge tone="brand">{x.matiere}</Badge>}
                  <span className="text-xs text-slate-400">{new Date(x.dateCreation).toLocaleString('fr-FR')}</span>
                </div>
                <p className="mt-1.5 font-medium text-slate-800 dark:text-slate-200">{x.eleveNomComplet}</p>
                {x.statut && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{x.statut}</p>}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
