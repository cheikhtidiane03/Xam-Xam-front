
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { enseignantApi } from '@/api/enseignant'

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

export function EnseignantDashboardPage() {
  const stats = useFetch(() => enseignantApi.statistiques(), [])
  const nominatives = useFetch(() => enseignantApi.statistiquesNominatives(), [])

  if (stats.chargement) return <FullPageSpinner />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Statistics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Overview of your students' thinking efforts.
        </p>
      </div>

      {stats.donnees && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Users} label="Students" valeur={stats.donnees.nombreEleves} />
          <StatCard icon={BookOpen} label="Processed Exercises" valeur={stats.donnees.nombreExercicesTraites} />
          <StatCard
            icon={TrendingUp}
            label="Reformulation Rate"
            valeur={`${Math.round(stats.donnees.tauxReformulationAtteinte)}%`}
          />
          <StatCard
            icon={Award}
            label="Average Score"
            valeur={`${Math.round(stats.donnees.scoreMoyenReformulation)}/100`}
          />
        </div>
      )}

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Individual Student Statistics</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Only students whose parents have explicitly authorized individual statistics appear here.
          </p>

          {nominatives.donnees && nominatives.donnees.length === 0 && (
            <EmptyState
              className="mt-4"
              titre="No students have granted this consent yet"
              description="Individual student statistics are displayed only with explicit parental consent."
            />
          )}

          {nominatives.donnees && nominatives.donnees.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                    <th className="pb-2 font-medium">Student</th>
                    <th className="pb-2 font-medium">Completed Exercises</th>
                    <th className="pb-2 font-medium">Average Score</th>
                  </tr>
                </thead>
                <tbody>
                  {nominatives.donnees.map((e) => (
                    <tr key={e.eleveId} className="border-b border-slate-50 dark:border-white/5">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{e.nomComplet}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{e.nombreExercicesTermines}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">
                        {Math.round(e.scoreMoyenReformulation)}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
