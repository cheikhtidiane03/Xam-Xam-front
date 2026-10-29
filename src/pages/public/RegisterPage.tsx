
import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/api/auth'
import { publicApi } from '@/api/public'
import { useAuth } from '@/hooks/useAuth'
import { messageErreur } from '@/hooks/useApiError'
import { notify } from '@/lib/notify'
import { cheminEspaceRole } from '@/routes/ProtectedRoute'
import type { Role } from '@/types/auth'
import type { EtablissementPublicResponse } from '@/types/etablissement'

const ROLES_PUBLICS: { value: Role; label: string }[] = [
  { value: 'ELEVE', label: 'Pupil / Student' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'ENSEIGNANT', label: 'Teacher' },
  { value: 'ADMIN_ETABLISSEMENT', label: 'Institution Administrator' },
]

const NIVEAUX_SCOLAIRES = [
  { groupe: 'Middle School', options: ['SIXIEME', 'CINQUIEME', 'QUATRIEME', 'TROISIEME'] },
  { groupe: 'High School', options: ['SECONDE', 'PREMIERE', 'TERMINALE'] },
  { groupe: 'Higher Education', options: ['LICENCE_1', 'LICENCE_2', 'LICENCE_3', 'MASTER_1', 'MASTER_2', 'DOCTORAT'] },
]

// Roles pour lesquels un etablissement doit obligatoirement etre choisi.
// L'Eleve peut aussi en choisir un (optionnel), mais peut aussi s'inscrire
// sans (cf. section 3.1 du cahier des charges : etudiants du superieur
// pas necessairement rattaches a un etablissement partenaire).
const ROLES_NECESSITANT_ETABLISSEMENT: Role[] = ['ENSEIGNANT', 'ADMIN_ETABLISSEMENT']
const ROLES_AVEC_ETABLISSEMENT_OPTIONNEL: Role[] = ['ELEVE']

export function RegisterPage() {
  const [role, setRole] = useState<Role>('ELEVE')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [niveauScolaire, setNiveauScolaire] = useState('TROISIEME')
  const [matiere, setMatiere] = useState('')
  const [etablissementId, setEtablissementId] = useState('')
  const [etablissements, setEtablissements] = useState<EtablissementPublicResponse[]>([])
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)

  const { setSession } = useAuth()
  const navigate = useNavigate()

  // Charge la liste des etablissements une seule fois au montage - endpoint
  // public, pas besoin d'etre connecte (voir GET /api/public/etablissements).
  useEffect(() => {
    publicApi.listerEtablissements()
      .then(setEtablissements)
      .catch(() => {
        // Si l'appel echoue (ex: backend indisponible), on laisse la liste
        // vide plutot que de bloquer toute la page d'inscription : les
        // roles ne necessitant pas d'etablissement restent utilisables.
        setEtablissements([])
      })
  }, [])

  const etablissementRequis = ROLES_NECESSITANT_ETABLISSEMENT.includes(role)
  const etablissementVisible = etablissementRequis || ROLES_AVEC_ETABLISSEMENT_OPTIONNEL.includes(role)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErreur(null)

    if (etablissementRequis && !etablissementId) {
      setErreur('Please select the institution this account belongs to.')
      return
    }

    setChargement(true)
    try {
      const auth = await authApi.register({
        nom,
        prenom,
        email,
        motDePasse,
        role,
        niveauScolaire: role === 'ELEVE' ? niveauScolaire : undefined,
        matiere: role === 'ENSEIGNANT' ? matiere : undefined,
        etablissementId: etablissementVisible && etablissementId ? etablissementId : undefined,
      })

      if (role === 'ELEVE' || role === 'PARENT') {
        setSession(auth)
        notify.succes('Account created! Welcome to Xaam-Xaam+.')
        navigate(cheminEspaceRole(auth.role), { replace: true })
      } else {
        notify.succes('Account created. A superadmin must approve your account before you can log in.')
        navigate('/connexion', { replace: true })
      }
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setChargement(false)
    }
  }

  return (
    <AuthLayout titre="Create an Account" sousTitre="Join Xaam-Xaam+ in just a few seconds">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Select label="I am a..." value={role} onChange={(e) => setRole(e.target.value as Role)}>
          {ROLES_PUBLICS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          <Input label="Last Name" required value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="Minimum 8 characters"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {role === 'ELEVE' && (
          <Select
            label="Education Level"
            value={niveauScolaire}
            onChange={(e) => setNiveauScolaire(e.target.value)}
          >
            {NIVEAUX_SCOLAIRES.map((groupe) => (
              <optgroup key={groupe.groupe} label={groupe.groupe}>
                {groupe.options.map((n) => (
                  <option key={n} value={n}>{n.replace('_', ' ')}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        )}

        {role === 'ENSEIGNANT' && (
          <Input
            label="Subject Taught"
            required
            placeholder="e.g. Mathematics"
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
          />
        )}

        {etablissementVisible && (
          <Select
            label={etablissementRequis ? 'Institution' : 'Institution (optional)'}
            required={etablissementRequis}
            value={etablissementId}
            onChange={(e) => setEtablissementId(e.target.value)}
          >
            <option value="">
              {etablissements.length === 0 ? 'No institutions available' : 'Select...'}
            </option>
            {etablissements.map((etab) => (
              <option key={etab.id} value={etab.id}>{etab.nom}</option>
            ))}
          </Select>
        )}

        {etablissementRequis && etablissements.length === 0 && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
            No institutions are available yet. Contact a Xaam-Xaam+ administrator to create one
            before you can create this type of account.
          </p>
        )}

        {(role === 'ENSEIGNANT' || role === 'ADMIN_ETABLISSEMENT') && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
            This type of account must be approved by a Xaam-Xaam+ administrator before you can log in.
          </p>
        )}

        {erreur && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {erreur}
          </p>
        )}

        <Button type="submit" loading={chargement} className="w-full">
          Create My Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/connexion" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Log In
        </Link>
      </p>
    </AuthLayout>
  )
}
