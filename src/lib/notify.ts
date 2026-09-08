import toast from 'react-hot-toast'
import { messageErreur } from '@/hooks/useApiError'

/** Helpers de notification uniformes, a utiliser partout plutot que
 * d'appeler react-hot-toast directement (facilite un changement de
 * librairie plus tard sans toucher chaque page). */
export const notify = {
  succes: (message: string) => toast.success(message),
  erreur: (error: unknown) => toast.error(messageErreur(error)),
  info: (message: string) => toast(message),
}
