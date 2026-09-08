import { Users, GraduationCap, Building2, Clock, BookOpen } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'

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

export function SuperadminDashboardPage() {
  const vue = useFetch(() => superadminApi.vueGlobale(), [])

  if (vue.chargement) return <FullPageSpinner />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Vue globale du projet</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">L'état de la plateforme Xaam-Xaam+ en un coup d'œil.</p>
      </div>

      {vue.donnees && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard icon={Users} label="Utilisateurs" valeur={vue.donnees.nombreUtilisateursTotal} />
          <StatCard icon={GraduationCap} label="Élèves actifs" valeur={vue.donnees.nombreElevesActifs} />
          <StatCard icon={Building2} label="Établissements validés" valeur={vue.donnees.nombreEtablissementsValides} />
          <StatCard icon={Clock} label="Établissements en attente" valeur={vue.donnees.nombreEtablissementsEnAttente} />
          <StatCard icon={BookOpen} label="Exercices aujourd'hui" valeur={vue.donnees.nombreExercicesAujourdHui} />
        </div>
      )}
    </div>
  )
}
