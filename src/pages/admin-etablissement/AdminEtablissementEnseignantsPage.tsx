import { useState, type FormEvent } from 'react'
import { Plus, Users } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { adminEtablissementApi } from '@/api/adminEtablissement'
import { notify } from '@/lib/notify'

export function AdminEtablissementEnseignantsPage() {
  const { donnees: enseignants, chargement, recharger } = useFetch(
    () => adminEtablissementApi.listerEnseignants(),
    []
  )
  const [modalOuverte, setModalOuverte] = useState(false)

  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [matiere, setMatiere] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setEnvoiEnCours(true)
    try {
      await adminEtablissementApi.creerEnseignant({ nom, prenom, email, motDePasse, matiere })
      notify.succes('Enseignant créé et activé !')
      setNom(''); setPrenom(''); setEmail(''); setMotDePasse(''); setMatiere('')
      setModalOuverte(false)
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setEnvoiEnCours(false)
    }
  }

  async function basculerActivation(id: string, actif: boolean) {
    try {
      if (actif) await adminEtablissementApi.desactiverEnseignant(id)
      else await adminEtablissementApi.reactiverEnseignant(id)
      notify.succes(actif ? 'Enseignant désactivé.' : 'Enseignant réactivé.')
      recharger()
    } catch (err) {
      notify.erreur(err)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Enseignants</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gère les comptes enseignants de ton établissement.</p>
        </div>
        <Button onClick={() => setModalOuverte(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Créer un enseignant
        </Button>
      </div>

      {chargement && <FullPageSpinner />}

      {enseignants && enseignants.length === 0 && (
        <EmptyState icon={<Users className="h-8 w-8" />} titre="Aucun enseignant pour l'instant" />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {enseignants?.map((ens) => (
          <Card key={ens.id}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{ens.prenom} {ens.nom}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{ens.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge tone="brand">{ens.matiere}</Badge>
                  <Badge tone={ens.actif ? 'success' : 'danger'}>{ens.actif ? 'Actif' : 'Inactif'}</Badge>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => basculerActivation(ens.id, ens.actif)}>
                {ens.actif ? 'Désactiver' : 'Réactiver'}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal ouvert={modalOuverte} onFermer={() => setModalOuverte(false)} titre="Créer un compte enseignant">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            <Input label="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Mot de passe"
            type="password"
            required
            minLength={8}
            hint="8 caractères minimum"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          <Input label="Matière" required value={matiere} onChange={(e) => setMatiere(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOuverte(false)}>Annuler</Button>
            <Button type="submit" loading={envoiEnCours}>Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
