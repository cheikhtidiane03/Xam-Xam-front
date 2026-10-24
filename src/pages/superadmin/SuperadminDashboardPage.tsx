import { Link } from 'react-router-dom'
import { Users, GraduationCap, Building2, Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'

function StatCard({
  icon: Icon,
  label,
  valeur,
  to,
  precision,
}: {
  icon: typeof Users
  label: string
  valeur: string | number
  to: string
  precision?: string
}) {
  return (
    <Link
      to={to}
      aria-label={`${label}${precision ? ` (${precision})` : ''} : ${valeur}. Voir le détail`}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <Card className="relative h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
        <CardBody className="flex h-full items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100">{valeur}</p>
            <p className="text-xs leading-snug text-slate-500 dark:text-slate-400">{label}</p>
            {precision && (
              <p className="text-[11px] leading-snug text-slate-400 dark:text-slate-500">{precision}</p>
            )}
          </div>
          <ChevronRight className="absolute right-2 top-2 h-4 w-4 text-brand-500 opacity-0 transition group-hover:opacity-100" />
        </CardBody>
      </Card>
    </Link>
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
        <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 2xl:grid-cols-5">
          <StatCard
            icon={Users}
            label="Utilisateurs"
            valeur={vue.donnees.nombreUtilisateursTotal}
            to="/superadmin/utilisateurs"
          />
          <StatCard
            icon={GraduationCap}
            label="Élèves actifs"
            precision="30 derniers jours"
            valeur={vue.donnees.nombreElevesActifs}
            to="/superadmin/utilisateurs?role=ELEVE&actif=true"
          />
          <StatCard
            icon={Building2}
            label="Établissements validés"
            valeur={vue.donnees.nombreEtablissementsValides}
            to="/superadmin/etablissements?statut=VALIDE"
          />
          <StatCard
            icon={Clock}
            label="Établissements en attente"
            valeur={vue.donnees.nombreEtablissementsEnAttente}
            to="/superadmin/etablissements?statut=EN_ATTENTE"
          />
          <StatCard
            icon={BookOpen}
            label="Exercices aujourd'hui"
            valeur={vue.donnees.nombreExercicesAujourdHui}
            to="/superadmin/exercices?periode=aujourdhui"
          />
        </div>
      )}
    </div>
  )
}
