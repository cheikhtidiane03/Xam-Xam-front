import { apiClient } from './client'
import type { UtilisateurAdmin } from '@/types/compte'
import type {
  EtablissementResponse, EtablissementRequest, VueGlobaleResponse, SignalementContournementResponse,
} from '@/types/etablissement'

export const superadminApi = {
  comptesEnAttente: () =>
    apiClient.get<UtilisateurAdmin[]>('/api/admin/comptes/en-attente').then((r) => r.data),

  validerCompte: (utilisateurId: string) =>
    apiClient.post<void>(`/api/admin/comptes/${utilisateurId}/valider`),

  suspendreCompte: (utilisateurId: string) =>
    apiClient.post<void>(`/api/admin/comptes/${utilisateurId}/suspendre`),

  creerEtablissement: (data: EtablissementRequest) =>
    apiClient.post<EtablissementResponse>('/api/admin/etablissements', data).then((r) => r.data),

  listerEtablissements: () =>
    apiClient.get<EtablissementResponse[]>('/api/admin/etablissements').then((r) => r.data),

  etablissementsEnAttente: () =>
    apiClient.get<EtablissementResponse[]>('/api/admin/etablissements/en-attente').then((r) => r.data),

  validerEtablissement: (etablissementId: string) =>
    apiClient
      .post<EtablissementResponse>(`/api/admin/etablissements/${etablissementId}/valider`)
      .then((r) => r.data),

  retirerEtablissement: (etablissementId: string) =>
    apiClient.delete<void>(`/api/admin/etablissements/${etablissementId}`),

  vueGlobale: () =>
    apiClient.get<VueGlobaleResponse>('/api/admin/vue-globale').then((r) => r.data),

  signalementsNonTraites: () =>
    apiClient
      .get<SignalementContournementResponse[]>('/api/admin/signalements-contournement')
      .then((r) => r.data),

  traiterSignalement: (signalementId: string) =>
    apiClient.post<void>(`/api/admin/signalements-contournement/${signalementId}/traiter`),
}
