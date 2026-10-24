import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users, Eye, EyeOff } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'

const LABEL_ROLE: Record<string, string> = {
  ELEVE: 'Élève',
  PARENT: 'Parent',
  ENSEIGNANT: 'Enseignant',
  ADMIN_ETABLISSEMENT: "Admin d'établissement",
  SUPERADMIN: 'Superadmin',
}

const FILTRES: { label: string; role: string | null; actif: boolean }[] = [
  { label: 'Tous', role: null, actif: false },
  { label: 'Élèves', role: 'ELEVE', actif: false },
  { label: 'Élèves actifs', role: 'ELEVE', actif: true },
  { label: 'Parents', role: 'PARENT', actif: false },
  { label: 'Enseignants', role: 'ENSEIGNANT', actif: false },
]

function masquer(texte: string) {
  return texte.length <= 1 ? '•' : texte[0] + '•'.repeat(Math.min(texte.length - 1, 6))
}

export function SuperadminUtilisateursPage() {
  const [params, setParams] = useSearchParams()
  const role = params.get('role')
  const actif = params.get('actif') === 'true'
  const [masque, setMasque] = useState(false)

  const { donnees: utilisateurs, chargement } = useFetch(
    () => superadminApi.listerUtilisateurs({ role: role ?? undefined, actif: actif || undefined }),
    [role, actif]
  )

  function choisir(f: (typeof FILTRES)[number]) {
    const p: Record<string, string> = {}
    if (f.role) p.role = f.role
    if (f.actif) p.actif = 'true'
    setParams(p)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Utilisateurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {utilisateurs ? `${utilisateurs.length} résultat(s)` : 'Tous les comptes de la plateforme.'}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setMasque((m) => !m)} className="gap-1.5">
          {masque ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {masque ? 'Afficher les identités' : 'Masquer les identités'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTRES.map((f) => {
          const selectionne = (f.role ?? null) === role && f.actif === actif
          return (
            <Button
              key={f.label}
              size="sm"
              variant={selectionne ? undefined : 'outline'}
              onClick={() => choisir(f)}
            >
              {f.label}
            </Button>
          )
        })}
      </div>

      {chargement && <FullPageSpinner />}

      {utilisateurs && utilisateurs.length === 0 && (
        <EmptyState icon={<Users className="h-8 w-8" />} titre="Aucun utilisateur pour ce filtre" />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {utilisateurs?.map((u, i) => (
          <Card key={u.id}>
            <CardBody>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {masque ? `Utilisateur ${i + 1}` : `${u.prenom} ${u.nom}`}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {masque ? masquer(u.email) + '@•••' : u.email}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge tone="brand">{LABEL_ROLE[u.role] ?? u.role}</Badge>
                {u.role === 'ELEVE' && (
                  <Badge tone="success">{u.nombreExercices} exercice(s)</Badge>
                )}
                {!u.actif && <Badge tone="danger">Compte inactif</Badge>}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Inscrit le {new Date(u.dateInscription).toLocaleDateString('fr-FR')}
                {' · '}
                {u.derniereActivite
                  ? `dernière activité le ${new Date(u.derniereActivite).toLocaleString('fr-FR')}`
                  : 'aucune activité'}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
