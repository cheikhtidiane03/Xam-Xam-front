import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Trash2, Download } from 'lucide-react'
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
      notify.succes('Export téléchargé.')
    } catch (err) {
      notify.erreur(err)
    } finally {
      setExportEnCours(false)
    }
  }

  async function confirmerSuppression() {
    setSuppressionEnCours(true)
    try {
      await eleveApi.supprimerMonCompte()
      notify.succes('Ton compte a été supprimé.')
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mon profil</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gère ton compte et tes données personnelles.</p>
      </div>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Informations</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Nom complet</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{prenom} {nom}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Email</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 dark:text-slate-400">Email vérifié</span>
              <span className={emailVerifie ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'font-medium text-amber-600 dark:text-amber-400'}>
                {emailVerifie ? 'Oui' : 'Non'}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Mes données</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Télécharge une copie de toutes tes données (exercices, tentatives, reformulations).
          </p>
          <Button variant="outline" size="sm" loading={exportEnCours} onClick={exporterMesDonnees} className="mt-3 gap-1.5">
            <Download className="h-4 w-4" /> Exporter mes données
          </Button>
        </CardBody>
      </Card>

      <Card className="border-red-200 dark:border-red-500/30">
        <CardBody>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
            <h2 className="font-semibold text-red-700 dark:text-red-400">Zone de danger</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Supprime définitivement ton compte et toutes tes données associées (exercices, badges, historique).
            Cette action est irréversible.
          </p>
          <Button variant="danger" size="sm" onClick={() => setModalSuppression(true)} className="mt-3 gap-1.5">
            <Trash2 className="h-4 w-4" /> Supprimer mon compte
          </Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        ouvert={modalSuppression}
        onFermer={() => setModalSuppression(false)}
        onConfirmer={confirmerSuppression}
        chargement={suppressionEnCours}
        titre="Supprimer définitivement ton compte ?"
        description="Toutes tes données (exercices, tentatives, badges, historique) seront supprimées immédiatement et définitivement. Cette action ne peut pas être annulée."
        texteConfirmation="SUPPRIMER"
        libelleBouton="Supprimer définitivement"
      />
    </div>
  )
}
