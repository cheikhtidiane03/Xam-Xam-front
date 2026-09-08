import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { parentApi } from '@/api/parent'
import { notify } from '@/lib/notify'
import type { CompteEleveResponse } from '@/types/compte'

export function RattacherEnfantModal({
  ouvert,
  onFermer,
  onRattache,
}: {
  ouvert: boolean
  onFermer: () => void
  onRattache: (enfant: CompteEleveResponse) => void
}) {
  const [code, setCode] = useState('')
  const [chargement, setChargement] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setChargement(true)
    try {
      const enfant = await parentApi.relierEnfant({ code: code.trim().toUpperCase() })
      notify.succes(`${enfant.prenom} est maintenant rattaché à ton compte !`)
      onRattache(enfant)
      setCode('')
      onFermer()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setChargement(false)
    }
  }

  return (
    <Modal ouvert={ouvert} onFermer={onFermer} titre="Rattacher un enfant">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Demande à ton enfant de générer un code depuis son compte Xaam-Xaam+
          (Mon compte → Générer un code de liaison), puis saisis-le ci-dessous.
          Le code expire au bout de 30 minutes.
        </p>
        <Input
          label="Code de liaison"
          required
          autoFocus
          placeholder="Ex : A3F9K2Q7"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onFermer}>Annuler</Button>
          <Button type="submit" loading={chargement}>Rattacher</Button>
        </div>
      </form>
    </Modal>
  )
}
