
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
  ELEVE: 'Student',
  PARENT: 'Parent',
  ENSEIGNANT: 'Teacher',
  ADMIN_ETABLISSEMENT: 'Institution Administrator',
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
      notify.succes('Account activated.')
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
      notify.succes('Account suspended.')
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {utilisateurs ? `${utilisateursFiltres.length} account(s)` : 'Loading…'}
            {actifRecent && ' · active students in the last 30 days'}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setMasque((m) => !m)} className="gap-1.5">
          {masque ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {masque ? 'Show Identities' : 'Hide Identities'}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
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
          <option value="TOUS">All Roles</option>
          {Object.entries(LABEL_ROLE).map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>{libelle}</option>
          ))}
        </select>
        <Button
          variant={actifRecent ? undefined : 'outline'}
          onClick={() => majFiltres(actifRecent ? filtreRole : 'ELEVE', !actifRecent)}
        >
          Active in the Last 30 Days
        </Button>
      </div>

      {chargement && <FullPageSpinner />}

      {utilisateursFiltres.length === 0 && !chargement && (
        <EmptyState icon={<Users className="h-8 w-8" />} titre="No Users Found" />
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-white/5">
            <tr className="text-left text-xs text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Registered On</th>
              <th className="px-4 py-3 font-medium">Last Activity</th>
              <th className="px-4 py-3 font-medium">Exercises</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateursFiltres.map((u, i) => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-white/5">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                  {masque ? `User ${i + 1}` : `${u.prenom} ${u.nom}`}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {masque ? `${masquer(u.email)}@•••` : u.email}
                </td>
                <td className="px-4 py-3"><Badge tone="brand">{LABEL_ROLE[u.role] ?? u.role}</Badge></td>
                <td className="px-4 py-3">
                  <Badge tone={u.actif ? 'success' : 'warning'}>{u.actif ? 'Active' : 'Inactive'}</Badge>
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
                      <Ban className="h-3.5 w-3.5" /> Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      loading={actionEnCours === u.id}
                      onClick={() => valider(u.id)}
                      className="gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Activate
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
        titre="Suspend this account?"
        description={
          compteASuspendre
            ? `${compteASuspendre.prenom} ${compteASuspendre.nom} (${compteASuspendre.email}) will no longer be able to log in until the account is reactivated.`
            : ''
        }
        libelleBouton="Suspend"
      />
    </div>
  )
}
