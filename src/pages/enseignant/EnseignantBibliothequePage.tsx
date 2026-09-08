import { useState, type FormEvent } from 'react'
import { Plus, Library } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { enseignantApi } from '@/api/enseignant'
import { notify } from '@/lib/notify'

export function EnseignantBibliothequePage() {
  const { donnees: exercices, chargement, recharger } = useFetch(
    () => enseignantApi.parcourirBibliotheque(),
    []
  )
  const [modalOuverte, setModalOuverte] = useState(false)

  const [titre, setTitre] = useState('')
  const [enonce, setEnonce] = useState('')
  const [matiere, setMatiere] = useState('')
  const [niveau, setNiveau] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setEnvoiEnCours(true)
    try {
      await enseignantApi.ajouterExerciceType({ titre, enonce, matiere, niveau })
      notify.succes('Exercice ajouté à la bibliothèque !')
      setTitre(''); setEnonce(''); setMatiere(''); setNiveau('')
      setModalOuverte(false)
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bibliothèque d'exercices</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Propose des exercices types que tes élèves pourront démarrer directement.
          </p>
        </div>
        <Button onClick={() => setModalOuverte(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Ajouter un exercice
        </Button>
      </div>

      {chargement && <FullPageSpinner />}

      {exercices && exercices.length === 0 && (
        <EmptyState
          icon={<Library className="h-8 w-8" />}
          titre="Aucun exercice type"
          description="Ajoute le premier exercice type de ta bibliothèque."
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
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal ouvert={modalOuverte} onFermer={() => setModalOuverte(false)} titre="Ajouter un exercice type">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input label="Titre" required value={titre} onChange={(e) => setTitre(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Énoncé</label>
            <textarea
              required
              rows={4}
              value={enonce}
              onChange={(e) => setEnonce(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Matière" required value={matiere} onChange={(e) => setMatiere(e.target.value)} />
            <Input label="Niveau" required value={niveau} onChange={(e) => setNiveau(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOuverte(false)}>Annuler</Button>
            <Button type="submit" loading={envoiEnCours}>Ajouter</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
