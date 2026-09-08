import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { NouvelExerciceModal } from '@/components/eleve/NouvelExerciceModal'
import { useFetch } from '@/hooks/useFetch'
import { eleveApi } from '@/api/eleve'
import type { StatutExercice } from '@/types/exercice'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'brand'

const STATUT_STYLE: Record<StatutExercice, { label: string; tone: Tone }> = {
  EN_COURS: { label: 'En cours', tone: 'warning' },
  REFORMULATION_EN_ATTENTE: { label: 'Reformulation à faire', tone: 'brand' },
  TERMINE: { label: 'Terminé', tone: 'success' },
  ABANDONNE: { label: 'Abandonné', tone: 'neutral' },
}

export function EleveExercicesPage() {
  const { donnees: exercices, chargement, erreur, recharger } = useFetch(() => eleveApi.listerExercices(), [])
  const [modalOuverte, setModalOuverte] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mes exercices</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ton parcours guidé, exercice par exercice.</p>
        </div>
        <Button onClick={() => setModalOuverte(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Nouvel exercice
        </Button>
      </div>

      {chargement && <FullPageSpinner />}
      {erreur && <p className="text-sm text-red-600 dark:text-red-400">{erreur}</p>}

      {exercices && exercices.length === 0 && (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          titre="Aucun exercice pour l'instant"
          description="Crée ton premier exercice pour démarrer ton parcours guidé."
          action={
            <Button size="sm" onClick={() => setModalOuverte(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Créer un exercice
            </Button>
          }
        />
      )}

      <div className="grid gap-3">
        {exercices?.map((ex) => {
          const style = STATUT_STYLE[ex.statut]
          return (
            <Link key={ex.id} to={`/eleve/exercices/${ex.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardBody className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone={style.tone}>{style.label}</Badge>
                      <span className="text-xs text-slate-400">{ex.matiere} · {ex.niveau}</span>
                    </div>
                    <p className="mt-1.5 truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                      {ex.enonce}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
                </CardBody>
              </Card>
            </Link>
          )
        })}
      </div>

      <NouvelExerciceModal
        ouvert={modalOuverte}
        onFermer={() => setModalOuverte(false)}
        onCree={() => recharger()}
      />
    </div>
  )
}
