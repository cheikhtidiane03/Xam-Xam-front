import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Library, ArrowRight } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { eleveApi } from '@/api/eleve'
import { notify } from '@/lib/notify'

export function EleveBibliothequePage() {
  const [matiere, setMatiere] = useState('')
  const [niveau, setNiveau] = useState('')
  const { donnees: exercices, chargement } = useFetch(
    () => eleveApi.parcourirBibliotheque(matiere || undefined, niveau || undefined),
    [matiere, niveau]
  )
  const [demarrageEnCours, setDemarrageEnCours] = useState<string | null>(null)
  const navigate = useNavigate()

  async function demarrerDepuisModele(id: string) {
    setDemarrageEnCours(id)
    try {
      const exercice = await eleveApi.creerExerciceDepuisBibliotheque(id)
      notify.succes('Exercise created from template!')
      navigate(`/eleve/exercices/${exercice.id}`)
    } catch (err) {
      notify.erreur(err)
    } finally {
      setDemarrageEnCours(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Exercise Library</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sample exercises provided by your teachers, ready to get started.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
        <Input placeholder="Subject" value={matiere} onChange={(e) => setMatiere(e.target.value)} />
        <Input placeholder="Level" value={niveau} onChange={(e) => setNiveau(e.target.value)} />
      </div>

      {chargement && <FullPageSpinner />}

      {exercices && exercices.length === 0 && (
        <EmptyState
          icon={<Library className="h-8 w-8" />}
          titre="No sample exercises found"
          description="Try broadening your search or come back later."
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {exercices?.map((ex) => (
          <Card key={ex.id}>
            <CardBody>
              <div className="flex items-center gap-2">
                <Badge tone="brand">{ex.matiere}</Badge>
                <Badge tone="neutral">{ex.niveau}</Badge>
              </div>
              <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">{ex.titre}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{ex.enonce}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 gap-1.5"
                loading={demarrageEnCours === ex.id}
                onClick={() => demarrerDepuisModele(ex.id)}
              >
                Start <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}