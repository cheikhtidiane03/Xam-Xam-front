import { Users, BookOpen, TrendingUp, Award } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { adminEtablissementApi } from '@/api/adminEtablissement'

function StatCard({ icon: Icon, label, valeur }: { icon: typeof Users; label: string; valeur: string | number }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{valeur}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </CardBody>
    </Card>
  )
}

export function AdminEtablissementDashboardPage() {
  const stats = useFetch(() => adminEtablissementApi.statistiques(), [])

  if (stats.chargement) return <FullPageSpinner />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Vue d'ensemble</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">L'activité de ton établissement en un coup d'œil.</p>
      </div>

      {stats.donnees && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Users} label="Élèves" valeur={stats.donnees.nombreEleves} />
          <StatCard icon={BookOpen} label="Exercices traités" valeur={stats.donnees.nombreExercicesTraites} />
          <StatCard
            icon={TrendingUp}
            label="Taux de reformulation"
            valeur={`${Math.round(stats.donnees.tauxReformulationAtteinte)}%`}
          />
          <StatCard
            icon={Award}
            label="Score moyen"
            valeur={`${Math.round(stats.donnees.scoreMoyenReformulation)}/100`}
          />
        </div>
      )}
    </div>
  )
}
