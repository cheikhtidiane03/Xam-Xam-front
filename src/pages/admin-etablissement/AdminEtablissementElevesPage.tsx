import { useState, type FormEvent } from 'react'
import { Plus, GraduationCap } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { adminEtablissementApi } from '@/api/adminEtablissement'
import { notify } from '@/lib/notify'

const NIVEAUX = [
  'SIXIEME', 'CINQUIEME', 'QUATRIEME', 'TROISIEME',
  'SECONDE', 'PREMIERE', 'TERMINALE',
  'LICENCE_1', 'LICENCE_2', 'LICENCE_3', 'MASTER_1', 'MASTER_2', 'DOCTORAT',
]

export function AdminEtablissementElevesPage() {
  const { donnees: eleves, chargement, recharger } = useFetch(() => adminEtablissementApi.listerEleves(), [])
  const [modalOuverte, setModalOuverte] = useState(false)

  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [niveauScolaire, setNiveauScolaire] = useState('TROISIEME')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setEnvoiEnCours(true)
    try {
      await adminEtablissementApi.creerEleve({ nom, prenom, email, motDePasse, niveauScolaire })
      notify.succes('Élève créé et activé !')
      setNom(''); setPrenom(''); setEmail(''); setMotDePasse('')
      setModalOuverte(false)
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setEnvoiEnCours(false)
    }
  }

  async function basculerActivation(eleveId: string, actif: boolean) {
    try {
      if (actif) await adminEtablissementApi.desactiverEleve(eleveId)
      else await adminEtablissementApi.reactiverEleve(eleveId)
      notify.succes(actif ? 'Élève désactivé.' : 'Élève réactivé.')
      recharger()
    } catch (err) {
      notify.erreur(err)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Élèves</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gère les comptes élèves de ton établissement.</p>
        </div>
        <Button onClick={() => setModalOuverte(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Créer un élève
        </Button>
      </div>

      {chargement && <FullPageSpinner />}

      {eleves && eleves.length === 0 && (
        <EmptyState icon={<GraduationCap className="h-8 w-8" />} titre="Aucun élève pour l'instant" />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {eleves?.map((el) => (
          <Card key={el.id}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{el.prenom} {el.nom}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{el.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge tone="neutral">{el.niveauScolaire.replace('_', ' ')}</Badge>
                  <Badge tone={el.actif ? 'success' : 'danger'}>{el.actif ? 'Actif' : 'Inactif'}</Badge>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => basculerActivation(el.id, el.actif)}>
                {el.actif ? 'Désactiver' : 'Réactiver'}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal ouvert={modalOuverte} onFermer={() => setModalOuverte(false)} titre="Créer un compte élève">
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
          <Select label="Niveau scolaire" value={niveauScolaire} onChange={(e) => setNiveauScolaire(e.target.value)}>
            {NIVEAUX.map((n) => <option key={n} value={n}>{n.replace('_', ' ')}</option>)}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOuverte(false)}>Annuler</Button>
            <Button type="submit" loading={envoiEnCours}>Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
