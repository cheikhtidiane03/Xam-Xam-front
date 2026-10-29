
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, BookOpen, Target, Zap, Clock } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { parentApi } from '@/api/parent'
import { notify } from '@/lib/notify'

function StatMini({ icon: Icon, label, valeur }: { icon: typeof BookOpen; label: string; valeur: string | number }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/5">
      <Icon className="h-4 w-4 text-brand-500" />
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{valeur}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

export function ParentEnfantDetailPage() {
  const { eleveId } = useParams<{ eleveId: string }>()

  const suivi = useFetch(() => parentApi.suiviEnfant(eleveId!), [eleveId])
  const progression = useFetch(() => parentApi.progressionEnfant(eleveId!), [eleveId])
  const consentement = useFetch(() => parentApi.consulterConsentement(eleveId!), [eleveId])

  const [maj, setMaj] = useState(false)
  const [export_, setExport_] = useState(false)

  async function toggleConsentement(champ: 'consentementDonnees' | 'consentementStatistiquesNominatives') {
    if (!consentement.donnees) return
    setMaj(true)
    try {
      await parentApi.mettreAJourConsentement(eleveId!, {
        consentementDonnees: consentement.donnees.consentementDonnees,
        consentementStatistiquesNominatives: consentement.donnees.consentementStatistiquesNominatives,
        [champ]: !consentement.donnees[champ],
      })
      notify.succes('Consent updated.')
      consentement.recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setMaj(false)
    }
  }

  async function exporterDonnees() {
    setExport_(true)
    try {
      const data = await parentApi.exporterDonneesEnfant(eleveId!)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `donnees-${data.prenom}-${data.nom}.json`
      a.click()
      URL.revokeObjectURL(url)
      notify.succes('Export downloaded.')
    } catch (err) {
      notify.erreur(err)
    } finally {
      setExport_(false)
    }
  }

  if (suivi.chargement) return <FullPageSpinner />

  return (
    <div className="flex flex-col gap-6">
      <Link to="/parent" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to My Children
      </Link>

      {suivi.donnees && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{suivi.donnees.nomComplet}</h1>
          <Button variant="outline" size="sm" loading={export_} onClick={exporterDonnees} className="gap-1.5">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      )}

      {suivi.donnees && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatMini icon={BookOpen} label="Completed" valeur={suivi.donnees.nombreExercicesTermines} />
          <StatMini icon={Target} label="In Progress" valeur={suivi.donnees.nombreExercicesEnCours} />
          <StatMini icon={Zap} label="Average Score" valeur={`${Math.round(suivi.donnees.scoreMoyenReformulation)}/100`} />
          <StatMini icon={Clock} label="Avg. Thinking Time" valeur={`${Math.round(suivi.donnees.tempsReflexionMoyenMinutes)} min`} />
        </div>
      )}

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Progress by Subject</h2>
          <div className="mt-4 flex flex-col gap-4">
            {progression.donnees?.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No subjects tracked yet.</p>
            )}
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

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Consent</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Control how your child's data is used.
          </p>

          {consentement.donnees && (
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Data Processing</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authorizes the general processing of your child's data on the platform.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 rounded"
                  checked={consentement.donnees.consentementDonnees}
                  disabled={maj}
                  onChange={() => toggleConsentement('consentementDonnees')}
                />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Identifiable Statistics</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Allows the institution to see your child's name in statistics. Otherwise, only aggregated and anonymous data is displayed.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 rounded"
                  checked={consentement.donnees.consentementStatistiquesNominatives}
                  disabled={maj}
                  onChange={() => toggleConsentement('consentementStatistiquesNominatives')}
                />
              </label>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
