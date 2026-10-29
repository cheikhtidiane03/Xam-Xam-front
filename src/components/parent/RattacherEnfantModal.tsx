
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
      notify.succes(`${enfant.prenom} has been linked to your account!`)
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
    <Modal ouvert={ouvert} onFermer={onFermer} titre="Link a Child">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ask your child to generate a code from their Xaam-Xaam+ account
          (My Account → Generate a Linking Code), then enter it below.
          The code expires after 30 minutes.
        </p>
        <Input
          label="Linking Code"
          required
          autoFocus
          placeholder="e.g. A3F9K2Q7"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onFermer}>Cancel</Button>
          <Button type="submit" loading={chargement}>Link Child</Button>
        </div>
      </form>
    </Modal>
  )
}
