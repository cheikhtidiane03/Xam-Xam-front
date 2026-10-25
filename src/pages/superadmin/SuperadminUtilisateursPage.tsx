import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users, Search, Ban, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useFetch } from '@/hooks/useFetch'
import { superadminApi } from '@/api/superadmin'
import { notify } from '@/lib/notify'
import type { UtilisateurListe } from '@/types/compte'

const LABEL_ROLE: Record<string, string> = {
  ELEVE: 'Élève',
  PARENT: 'Parent',
  ENSEIGNANT: 'Enseignant',
  ADMIN_ETABLISSEMENT: 'Admin établissement',
  SUPERADMIN: 'Superadmin',
}

function masquer(texte: string) {
  return texte.length <= 1 ? '•' : texte[0] + '•'.repeat(Math.min(texte.length - 1, 6))
}

export function SuperadminUtilisateursPage() {
  const [params, setParams] = useSearchParams()
  const filtreRole = params.get('role') ?? 'TOUS'
  const actifRecent = params.get('actif') === 'true'

  const { donnees: utilisateurs, chargement, recharger } = useFetch(
    () =>
      superadminApi.listerUtilisateurs({
        role: filtreRole === 'TOUS' ? undefined : filtreRole,
        actif: actifRecent || undefined,
      }),
    [filtreRole, actifRecent]
  )

  const [recherche, setRecherche] = useState('')
  const [masque, setMasque] = useState(false)
  const [actionEnCours, setActionEnCours] = useState<string | null>(null)
  const [compteASuspendre, setCompteASuspendre] = useState<UtilisateurListe | null>(null)

  function majFiltres(role: string, actif: boolean) {
    const p: Record<string, string> = {}
    if (role !== 'TOUS') p.role = role
    if (actif) p.actif = 'true'
    setParams(p)
  }

  const utilisateursFiltres = (utilisateurs ?? []).filter(
    (u) =>
      recherche.trim() === '' ||
      `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(recherche.toLowerCase())
  )

  async function valider(id: string) {
    setActionEnCours(id)
    try {
      await superadminApi.validerCompte(id)
      notify.succes('Compte activé.')
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setActionEnCours(null)
    }
  }

  async function confirmerSuspension() {
    if (!compteASuspendre) return
    setActionEnCours(compteASuspendre.id)
    try {
      await superadminApi.suspendreCompte(compteASuspendre.id)
      notify.succes('Compte suspendu.')
      setCompteASuspendre(null)
      recharger()
    } catch (err) {
      notify.erreur(err)
    } finally {
      setActionEnCours(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tous les utilisateurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {utilisateurs ? `${utilisateursFiltres.length} compte(s)` : 'Chargement…'}
            {actifRecent && ' · élèves actifs sur les 30 derniers jours'}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setMasque((m) => !m)} className="gap-1.5">
          {masque ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {masque ? 'Afficher les identités' : 'Masquer les identités'}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filtreRole}
          onChange={(e) => majFiltres(e.target.value, actifRecent)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        >
          <option value="TOUS">Tous les rôles</option>
          {Object.entries(LABEL_ROLE).map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>{libelle}</option>
          ))}
        </select>
        <Button
          variant={actifRecent ? undefined : 'outline'}
          onClick={() => majFiltres(actifRecent ? filtreRole : 'ELEVE', !actifRecent)}
        >
          Actifs sur 30 jours
        </Button>
      </div>

      {chargement && <FullPageSpinner />}

      {utilisateursFiltres.length === 0 && !chargement && (
        <EmptyState icon={<Users className="h-8 w-8" />} titre="Aucun utilisateur trouvé" />
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-white/5">
            <tr className="text-left text-xs text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
              <th className="px-4 py-3 font-medium">Dernière activité</th>
              <th className="px-4 py-3 font-medium">Exercices</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateursFiltres.map((u, i) => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-white/5">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                  {masque ? `Utilisateur ${i + 1}` : `${u.prenom} ${u.nom}`}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {masque ? `${masquer(u.email)}@•••` : u.email}
                </td>
                <td className="px-4 py-3"><Badge tone="brand">{LABEL_ROLE[u.role] ?? u.role}</Badge></td>
                <td className="px-4 py-3">
                  <Badge tone={u.actif ? 'success' : 'warning'}>{u.actif ? 'Actif' : 'Inactif'}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {new Date(u.dateInscription).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {u.derniereActivite ? new Date(u.derniereActivite).toLocaleString('fr-FR') : '—'}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {u.role === 'ELEVE' ? u.nombreExercices : '—'}
                </td>
                <td className="px-4 py-3">
                  {u.actif ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={actionEnCours === u.id}
                      onClick={() => setCompteASuspendre(u)}
                      className="gap-1 text-red-600 dark:text-red-400"
                    >
                      <Ban className="h-3.5 w-3.5" /> Suspendre
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      loading={actionEnCours === u.id}
                      onClick={() => valider(u.id)}
                      className="gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Activer
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        ouvert={compteASuspendre !== null}
        onFermer={() => setCompteASuspendre(null)}
        onConfirmer={confirmerSuspension}
        chargement={actionEnCours === compteASuspendre?.id}
        titre="Suspendre ce compte ?"
        description={
          compteASuspendre
            ? `${compteASuspendre.prenom} ${compteASuspendre.nom} (${compteASuspendre.email}) ne pourra plus se connecter tant que le compte n'est pas réactivé.`
            : ''
        }
        libelleBouton="Suspendre"
      />
    </div>
  )
}
