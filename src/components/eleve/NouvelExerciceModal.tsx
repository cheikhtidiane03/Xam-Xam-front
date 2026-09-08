import { useState, type FormEvent } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { eleveApi } from '@/api/eleve'
import { notify } from '@/lib/notify'
import type { ExerciceResponse } from '@/types/exercice'

export function NouvelExerciceModal({
  ouvert,
  onFermer,
  onCree,
}: {
  ouvert: boolean
  onFermer: () => void
  onCree: (exercice: ExerciceResponse) => void
}) {
  const [enonce, setEnonce] = useState('')
  const [matiere, setMatiere] = useState('')
  const [niveau, setNiveau] = useState('')
  const [chargement, setChargement] = useState(false)
  const [ocrEnCours, setOcrEnCours] = useState(false)

  function reinitialiser() {
    setEnonce('')
    setMatiere('')
    setNiveau('')
  }

  async function onFichierChoisi(fichier: File | undefined) {
    if (!fichier) return
    setOcrEnCours(true)
    try {
      const { texteExtrait } = await eleveApi.extraireTexteOcr(fichier)
      setEnonce(texteExtrait)
      notify.succes('Texte extrait de la photo !')
    } catch (err) {
      notify.erreur(err)
    } finally {
      setOcrEnCours(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setChargement(true)
    try {
      const exercice = await eleveApi.creerExercice({ enonce, matiere, niveau })
      notify.succes('Exercice créé !')
      onCree(exercice)
      reinitialiser()
      onFermer()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setChargement(false)
    }
  }

  return (
    <Modal ouvert={ouvert} onFermer={onFermer} titre="Nouvel exercice">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Énoncé</label>
          <textarea
            required
            rows={4}
            value={enonce}
            onChange={(e) => setEnonce(e.target.value)}
            placeholder="Colle ou écris ton énoncé, ou importe une photo ci-dessous..."
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
          />

          <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
            {ocrEnCours ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            {ocrEnCours ? 'Extraction du texte...' : 'Importer une photo de l\'exercice'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={ocrEnCours}
              onChange={(e) => onFichierChoisi(e.target.files?.[0])}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Matière"
            required
            placeholder="Mathématiques"
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
          />
          <Input
            label="Niveau"
            required
            placeholder="TROISIEME"
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onFermer}>Annuler</Button>
          <Button type="submit" loading={chargement}>Créer l'exercice</Button>
        </div>
      </form>
    </Modal>
  )
}
