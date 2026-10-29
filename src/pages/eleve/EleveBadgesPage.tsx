import { Award } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { eleveApi } from '@/api/eleve'

export function EleveBadgesPage() {
  const { donnees: badges, chargement } = useFetch(() => eleveApi.mesBadges(), [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Badges</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Rewards earned as you progress.
        </p>
      </div>

      {chargement && <FullPageSpinner />}

      {badges && badges.length === 0 && (
        <EmptyState
          icon={<Award className="h-8 w-8" />}
          titre="No badges yet"
          description="Complete exercises and improve your reformulations to unlock your first badges."
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges?.map((b) => (
          <Card key={b.code}>
            <CardBody className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Award className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{b.nom}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{b.description}</p>
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  Earned on {new Date(b.dateObtention).toLocaleDateString('en-GB')}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}