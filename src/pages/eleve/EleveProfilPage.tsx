import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Trash2, Download, KeyRound, Copy, Check } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { eleveApi } from '@/api/eleve'
import { notify } from '@/lib/notify'

export function EleveProfilPage() {
  const { nom, prenom, email, emailVerifie, clearSession } = useAuth()
  const [modalSuppression, setModalSuppression] = useState(false)
  const [suppressionEnCours, setSuppressionEnCours] = useState(false)
  const [exportEnCours, setExportEnCours] = useState(false)

  const [codeLiaison, setCodeLiaison] = useState<{ code: string; dateExpiration: string } | null>(null)
  const [genererCodeEnCours, setGenererCodeEnCours] = useState(false)
  const [copie, setCopie] = useState(false)

  const navigate = useNavigate()

  async function exporterMesDonnees() {
    setExportEnCours(true)
    try {
      const data = await eleveApi.exporterMesDonnees()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mes-donnees-${prenom}-${nom}.json`
      a.click()
      URL.revokeObjectURL(url)
      notify.succes('Export downloaded.')
    } catch (err) {
      notify.erreur(err)
    } finally {
      setExportEnCours(false)
    }
  }

  async function genererCode() {
    setGenererCodeEnCours(true)
    setCopie(false)
    try {
      const reponse = await eleveApi.genererCodeLiaisonParent()
      setCodeLiaison(reponse)
    } catch (err) {
      notify.erreur(err)
    } finally {
      setGenererCodeEnCours(false)
    }
  }

  async function copierCode() {
    if (!codeLiaison) return
    await navigator.clipboard.writeText(codeLiaison.code)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  async function confirmerSuppression() {
    setSuppressionEnCours(true)
    try {
      await eleveApi.supprimerMonCompte()
      notify.succes('Your account has been deleted.')
      clearSession()
      navigate('/', { replace: true })
    } catch (err) {
      notify.erreur(err)
      setSuppressionEnCours(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account and personal data.</p>
      </div>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Information</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Full Name</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{prenom} {nom}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Email</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 dark:text-slate-400">Email Verified</span>
              <span className={emailVerifie ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'font-medium text-amber-600 dark:text-amber-400'}>
                {emailVerifie ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4.5 w-4.5 text-brand-500" />
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Link a Parent Account</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Generate a temporary code (valid for 30 minutes) and share it with your parent so they can
            track your progress. They will need to enter it in their own account.
          </p>

          {!codeLiaison ? (
            <Button variant="outline" size="sm" loading={genererCodeEnCours} onClick={genererCode} className="mt-3 gap-1.5">
              <KeyRound className="h-4 w-4" /> Generate Code
            </Button>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 dark:bg-brand-500/10">
              <span className="flex-1 font-mono text-xl font-bold tracking-widest text-brand-700 dark:text-brand-400">
                {codeLiaison.code}
              </span>
              <button
                onClick={copierCode}
                title="Copy Code"
                className="rounded-lg p-2 text-brand-600 hover:bg-brand-100 dark:text-brand-400 dark:hover:bg-brand-500/10"
              >
                {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          )}

          {codeLiaison && (
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Expires at {new Date(codeLiaison.dateExpiration).toLocaleTimeString('en-GB')} — generate a new code
              if it expires before your parent uses it.
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">My Data</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Download a copy of all your data (exercises, attempts, and reformulations).
          </p>
          <Button variant="outline" size="sm" loading={exportEnCours} onClick={exporterMesDonnees} className="mt-3 gap-1.5">
            <Download className="h-4 w-4" /> Export My Data
          </Button>
        </CardBody>
      </Card>

      <Card className="border-red-200 dark:border-red-500/30">
        <CardBody>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
            <h2 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Permanently delete your account and all associated data (exercises, badges, and history).
            This action is irreversible.
          </p>
          <Button variant="danger" size="sm" onClick={() => setModalSuppression(true)} className="mt-3 gap-1.5">
            <Trash2 className="h-4 w-4" /> Delete My Account
          </Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        ouvert={modalSuppression}
        onFermer={() => setModalSuppression(false)}
        onConfirmer={confirmerSuppression}
        chargement={suppressionEnCours}
        titre="Permanently Delete Your Account?"
        description="All your data (exercises, attempts, badges, and history) will be deleted immediately and permanently. This action cannot be undone."
        texteConfirmation="DELETE"
        libelleBouton="Delete Permanently"
      />
    </div>
  )
}