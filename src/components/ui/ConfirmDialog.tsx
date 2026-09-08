import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'

interface ConfirmDialogProps {
  ouvert: boolean
  onFermer: () => void
  onConfirmer: () => void | Promise<void>
  titre: string
  description: string
  /** Texte a saisir mot pour mot pour activer le bouton (protection supplementaire
   * pour les actions les plus sensibles, ex: suppression definitive de compte). */
  texteConfirmation?: string
  libelleBouton?: string
  chargement?: boolean
}

export function ConfirmDialog({
  ouvert,
  onFermer,
  onConfirmer,
  titre,
  description,
  texteConfirmation,
  libelleBouton = 'Confirmer',
  chargement = false,
}: ConfirmDialogProps) {
  const [saisie, setSaisie] = useState('')
  const verrouille = Boolean(texteConfirmation) && saisie !== texteConfirmation

  function fermerEtReinitialiser() {
    setSaisie('')
    onFermer()
  }

  return (
    <Modal ouvert={ouvert} onFermer={fermerEtReinitialiser} titre={titre}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 rounded-xl bg-red-50 p-3 dark:bg-red-500/10">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">{description}</p>
        </div>

        {texteConfirmation && (
          <Input
            label={`Tape "${texteConfirmation}" pour confirmer`}
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            autoFocus
          />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={fermerEtReinitialiser}>Annuler</Button>
          <Button
            variant="danger"
            disabled={verrouille}
            loading={chargement}
            onClick={async () => {
              await onConfirmer()
              fermerEtReinitialiser()
            }}
          >
            {libelleBouton}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
