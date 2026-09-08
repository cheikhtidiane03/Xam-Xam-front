import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/api/auth'
import { useAuth } from '@/hooks/useAuth'
import { messageErreur } from '@/hooks/useApiError'
import { notify } from '@/lib/notify'
import { cheminEspaceRole } from '@/routes/ProtectedRoute'
import type { Role } from '@/types/auth'

const ROLES_PUBLICS: { value: Role; label: string }[] = [
  { value: 'ELEVE', label: 'Élève / Étudiant' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'ENSEIGNANT', label: 'Enseignant' },
  { value: 'ADMIN_ETABLISSEMENT', label: "Administrateur d'établissement" },
]

const NIVEAUX_SCOLAIRES = [
  { groupe: 'Collège', options: ['SIXIEME', 'CINQUIEME', 'QUATRIEME', 'TROISIEME'] },
  { groupe: 'Lycée', options: ['SECONDE', 'PREMIERE', 'TERMINALE'] },
  { groupe: 'Supérieur', options: ['LICENCE_1', 'LICENCE_2', 'LICENCE_3', 'MASTER_1', 'MASTER_2', 'DOCTORAT'] },
]

export function RegisterPage() {
  const [role, setRole] = useState<Role>('ELEVE')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [niveauScolaire, setNiveauScolaire] = useState('TROISIEME')
  const [matiere, setMatiere] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)

  const { setSession } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErreur(null)
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
      })

      if (role === 'ELEVE' || role === 'PARENT') {
        setSession(auth)
        notify.succes('Compte créé ! Bienvenue sur Xaam-Xaam+.')
        navigate(cheminEspaceRole(auth.role), { replace: true })
      } else {
        notify.succes('Compte créé. Un superadmin doit valider ton compte avant que tu puisses te connecter.')
        navigate('/connexion', { replace: true })
      }
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setChargement(false)
    }
  }

  return (
    <AuthLayout titre="Créer un compte" sousTitre="Rejoins Xaam-Xaam+ en quelques secondes">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Select label="Je suis..." value={role} onChange={(e) => setRole(e.target.value as Role)}>
          {ROLES_PUBLICS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Prénom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          <Input label="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
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
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="8 caractères minimum"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {role === 'ELEVE' && (
          <Select
            label="Niveau scolaire"
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
            label="Matière enseignée"
            required
            placeholder="Ex : Mathématiques"
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
          />
        )}

        {(role === 'ENSEIGNANT' || role === 'ADMIN_ETABLISSEMENT') && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
            Ce type de compte doit être validé par un administrateur Xaam-Xaam+ avant de pouvoir se connecter.
          </p>
        )}

        {erreur && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {erreur}
          </p>
        )}

        <Button type="submit" loading={chargement} className="w-full">
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Déjà un compte ?{' '}
        <Link to="/connexion" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Connecte-toi
        </Link>
      </p>
    </AuthLayout>
  )
}
