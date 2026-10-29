import { Link } from 'react-router-dom'
import { BookOpen, Award, Zap, Clock, Target, Plus } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/hooks/useAuth'
import { eleveApi } from '@/api/eleve'

function StatCard({
  icon: Icon,
  label,
  valeur,
}: {
  icon: typeof BookOpen
  label: string
  valeur: string | number
}) {
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

export function EleveDashboardPage() {
  const { prenom } = useAuth()
  const suivi = useFetch(() => eleveApi.monTableauDeBord(), [])
  const progression = useFetch(() => eleveApi.maProgression(), [])
  const badges = useFetch(() => eleveApi.mesBadges(), [])
  const quota = useFetch(() => eleveApi.quotaIaRestant(), [])

  if (suivi.chargement) return <FullPageSpinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Hi {prenom} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here's how you're progressing on your learning journey.
          </p>
        </div>
        <Link to="/eleve/exercices">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" /> New Exercise
          </Button>
        </Link>
      </div>

      {suivi.erreur && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {suivi.erreur}
        </p>
      )}

      {suivi.donnees && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={BookOpen} label="Completed Exercises" valeur={suivi.donnees.nombreExercicesTermines} />
          <StatCard icon={Target} label="In Progress" valeur={suivi.donnees.nombreExercicesEnCours} />
          <StatCard
            icon={Zap}
            label="Average Score"
            valeur={`${Math.round(suivi.donnees.scoreMoyenReformulation)}/100`}
          />
          <StatCard
            icon={Clock}
            label="Average Thinking Time"
            valeur={`${Math.round(suivi.donnees.tempsReflexionMoyenMinutes)} min`}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress by subject */}
        <Card className="lg:col-span-2">
          <CardBody>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Progress by Subject</h2>

            {progression.chargement && <p className="mt-3 text-sm text-slate-400">Loading...</p>}

            {progression.donnees && progression.donnees.length === 0 && (
              <EmptyState
                titre="No subjects tracked yet"
                description="Create your first exercise to see your progress here."
                className="mt-3"
              />
            )}

            <div className="mt-4 flex flex-col gap-4">
              {progression.donnees?.map((p) => (
                <div key={p.matiere}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{p.matiere}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {p.nombreExercicesTermines} completed · {Math.round(p.scoreMoyenReformulation)}/100
                    </span>
                  </div>
                  <ProgressBar valeur={p.scoreMoyenReformulation} className="mt-1.5" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* AI quota + badges recap */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Daily AI Quota</h2>
              <p className="mt-3 text-3xl font-bold text-brand-600 dark:text-brand-400">
                {quota.donnees ?? '—'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">requests remaining today</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">My Badges</h2>
                <Link to="/eleve/badges" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
                  View All
                </Link>
              </div>
              {badges.donnees && badges.donnees.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  No badges yet — complete your first exercise!
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {badges.donnees?.slice(0, 4).map((b) => (
                    <span
                      key={b.code}
                      title={b.description}
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-400"
                    >
                      <Award className="h-3 w-3" /> {b.nom}
                    </span>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}