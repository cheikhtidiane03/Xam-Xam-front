import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Building2, CheckCircle2, Trash2 } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'
import { notify } from '@/lib/notify'
import type { EtablissementResponse, TypeEtablissement } from '@/types/etablissement'

const FILTRES: { valeur: string | null; label: string }[] = [
  { valeur: null, label: 'Tous' },
  { valeur: 'VALIDE', label: 'Validés' },
  { valeur: 'EN_ATTENTE', label: 'En attente' },
]

export function SuperadminEtablissementsPage() {
  const { donnees: etablissements, chargement, recharger } = useFetch(
    () => superadminApi.listerEtablissements(),
    []
  )
  const [params, setParams] = useSearchParams()
  const statut = params.get('statut') // 'VALIDE' | 'EN_ATTENTE' | null

  const etablissementsFiltres = etablissements?.filter((e) =>
    statut === 'EN_ATTENTE' ? e.enAttenteValidation
    : statut === 'VALIDE' ? !e.enAttenteValidation
    : true
  )

  const [modalOuverte, setModalOuverte] = useState(false)
  const [etablissementARetirer, setEtablissementARetirer] = useState<EtablissementResponse | null>(null)

  const [nom, setNom] = useState('')
  const [type, setType] = useState<TypeEtablissement>('LYCEE')
  const [adresse, setAdresse] = useState('')
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [validationEnCours, setValidationEnCours] = useState<string | null>(null)
  const [suppressionEnCours, setSuppressionEnCours] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setEnvoiEnCours(true)
    try {
      await superadminApi.creerEtablissement({ nom, type, adresse })
      notify.succes('Établissement créé (en attente de validation).')
      setNom(''); setAdresse('')
      setModalOuverte(false)
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setEnvoiEnCours(false)
    }
  }

  async function valider(id: string) {
    setValidationEnCours(id)
    try {
      await superadminApi.validerEtablissement(id)
      notify.succes('Établissement validé, licence activée.')
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setValidationEnCours(null)
    }
  }

  async function confirmerRetrait() {
    if (!etablissementARetirer) return
    setSuppressionEnCours(true)
    try {
      await superadminApi.retirerEtablissement(etablissementARetirer.id)
      notify.succes('Établissement retiré.')
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setSuppressionEnCours(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Établissements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gère les établissements partenaires.</p>
        </div>
        <Button onClick={() => setModalOuverte(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Ajouter un établissement
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTRES.map((f) => (
          <Button
            key={f.label}
            size="sm"
            variant={statut === f.valeur ? undefined : 'outline'}
            onClick={() => (f.valeur ? setParams({ statut: f.valeur }) : setParams({}))}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {chargement && <FullPageSpinner />}

      {etablissementsFiltres && etablissementsFiltres.length === 0 && (
        <EmptyState icon={<Building2 className="h-8 w-8" />} titre="Aucun établissement" />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {etablissementsFiltres?.map((etab) => (
          <Card key={etab.id}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{etab.nom}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{etab.type.replace('_', '/')}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge tone={etab.licenceActive ? 'success' : 'warning'}>
                    {etab.licenceActive ? 'Licence active' : 'Licence inactive'}
                  </Badge>
                  {etab.enAttenteValidation && <Badge tone="danger">En attente</Badge>}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {etab.enAttenteValidation && (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={validationEnCours === etab.id}
                    onClick={() => valider(etab.id)}
                    className="gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Valider
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEtablissementARetirer(etab)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal ouvert={modalOuverte} onFermer={() => setModalOuverte(false)} titre="Ajouter un établissement">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input label="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
          <Select label="Type" value={type} onChange={(e) => setType(e.target.value as TypeEtablissement)}>
            <option value="COLLEGE">Collège</option>
            <option value="LYCEE">Lycée</option>
            <option value="COLLEGE_LYCEE">Collège/Lycée</option>
          </Select>
          <Input label="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOuverte(false)}>Annuler</Button>
            <Button type="submit" loading={envoiEnCours}>Créer</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        ouvert={etablissementARetirer !== null}
        onFermer={() => setEtablissementARetirer(null)}
        onConfirmer={confirmerRetrait}
        chargement={suppressionEnCours}
        titre="Retirer cet établissement ?"
        description={
          etablissementARetirer
            ? `"${etablissementARetirer.nom}" sera définitivement retiré. Cette action est irréversible.`
            : ''
        }
        texteConfirmation={etablissementARetirer?.nom}
        libelleBouton="Retirer définitivement"
      />
    </div>
  )
}
