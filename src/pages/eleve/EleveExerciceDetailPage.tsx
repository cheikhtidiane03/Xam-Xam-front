import { useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Lightbulb, Send, CheckCircle2, MessageCircleQuestion } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { eleveApi } from '@/api/eleve'
import { notify } from '@/lib/notify'
import type { IndiceResponse, ReformulationResponse } from '@/types/exercice'

interface EchangeLocal {
  role: 'eleve' | 'ia'
  texte: string
}

export function EleveExerciceDetailPage() {
  const { exerciceId } = useParams<{ exerciceId: string }>()
  const { donnees: exercice, chargement, erreur } = useFetch(
    () => eleveApi.recupererExercice(exerciceId!),
    [exerciceId]
  )

  const [echanges, setEchanges] = useState<EchangeLocal[]>([])
  const [contenuTentative, setContenuTentative] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  const [indices, setIndices] = useState<IndiceResponse[]>([])
  const [chargementIndice, setChargementIndice] = useState(false)

  const [modeReformulation, setModeReformulation] = useState(false)
  const [texteReformulation, setTexteReformulation] = useState('')
  const [resultat, setResultat] = useState<ReformulationResponse | null>(null)
  const [envoiReformulation, setEnvoiReformulation] = useState(false)

  if (chargement) return <FullPageSpinner />
  if (erreur || !exercice) {
    return <p className="text-sm text-red-600 dark:text-red-400">{erreur ?? 'Exercise not found.'}</p>
  }

  async function onSoumettreTentative(e: FormEvent) {
    e.preventDefault()
    if (!contenuTentative.trim()) return
    const texteEnvoye = contenuTentative
    setEchanges((prev) => [...prev, { role: 'eleve', texte: texteEnvoye }])
    setContenuTentative('')
    setEnvoiEnCours(true)
    try {
      const reponse = await eleveApi.soumettreTentative(exerciceId!, { contenu: texteEnvoye })
      setEchanges((prev) => [...prev, { role: 'ia', texte: reponse.relanceIa }])
    } catch (err) {
      notify.erreur(err)
    } finally {
      setEnvoiEnCours(false)
    }
  }

  async function onDebloquerIndice() {
    setChargementIndice(true)
    try {
      const indice = await eleveApi.debloquerIndiceSuivant(exerciceId!)
      setIndices((prev) => [...prev, indice])
    } catch (err) {
      notify.erreur(err)
    } finally {
      setChargementIndice(false)
    }
  }

  async function onSoumettreReformulation(e: FormEvent) {
    e.preventDefault()
    setEnvoiReformulation(true)
    try {
      const res = await eleveApi.soumettreReformulation(exerciceId!, { texte: texteReformulation })
      setResultat(res)
      notify.succes('Reformulation evaluated!')
    } catch (err) {
      notify.erreur(err)
    } finally {
      setEnvoiReformulation(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/eleve/exercices" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to Exercises
      </Link>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2">
            <Badge tone="brand">{exercice.matiere}</Badge>
            <Badge tone="neutral">{exercice.niveau}</Badge>
          </div>
          <p className="mt-3 text-slate-800 dark:text-slate-200">{exercice.enonce}</p>
        </CardBody>
      </Card>

      {resultat ? (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Score: {resultat.score}/100
            </p>
            <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">{resultat.feedbackIa}</p>
            <Link to="/eleve/exercices">
              <Button variant="outline" className="mt-2">Back to My Exercises</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Fil de discussion socratique */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="h-4.5 w-4.5 text-brand-500" />
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Your Guided Learning Journey</h2>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {echanges.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Write your first attempt below — the AI will ask you a question to help you make progress.
                  </p>
                )}
                {echanges.map((e, i) => (
                  <div
                    key={i}
                    className={
                      e.role === 'eleve'
                        ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-2.5 text-sm text-ink-950'
                        : 'mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-800 dark:bg-white/5 dark:text-slate-200'
                    }
                  >
                    {e.texte}
                  </div>
                ))}
              </div>

              <form onSubmit={onSoumettreTentative} className="mt-4 flex gap-2">
                <input
                  value={contenuTentative}
                  onChange={(e) => setContenuTentative(e.target.value)}
                  placeholder="Write your attempt or answer the AI's question..."
                  className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
                <Button type="submit" loading={envoiEnCours} disabled={!contenuTentative.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Indices */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">Hints</h2>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  loading={chargementIndice}
                  disabled={indices.length >= 3}
                  onClick={onDebloquerIndice}
                >
                  {indices.length >= 3 ? 'All Unlocked' : `Unlock Hint ${indices.length + 1}`}
                </Button>
              </div>

              {indices.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Stuck? Unlock a progressive hint (3 levels available).
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {indices.map((ind) => (
                    <div
                      key={ind.id}
                      className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-300"
                    >
                      <span className="font-medium">Hint {ind.niveau}:</span> {ind.contenu}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Reformulation finale */}
          <Card>
            <CardBody>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Final Step: Explain Your Approach
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                In your own words, explain how you solved (or tried to solve) this exercise.
              </p>

              {!modeReformulation ? (
                <Button variant="secondary" className="mt-3" onClick={() => setModeReformulation(true)}>
                  I'm Ready to Explain
                </Button>
              ) : (
                <form onSubmit={onSoumettreReformulation} className="mt-3 flex flex-col gap-3">
                  <textarea
                    required
                    rows={4}
                    value={texteReformulation}
                    onChange={(e) => setTexteReformulation(e.target.value)}
                    placeholder="Explain your approach in your own words..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  />
                  <Button type="submit" loading={envoiReformulation} className="self-start">
                    Submit My Explanation
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  )
}