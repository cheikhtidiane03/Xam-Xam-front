import { apiClient } from './client'
import type { EleveSuiviResponse, ProgressionMatiereResponse } from '@/types/exercice'
import type { CompteEleveResponse } from '@/types/compte'
import type { ConsentementRequest, ConsentementResponse, DonneesEleveExportResponse, RelierEnfantRequest } from '@/types/conformite'
import type { Abonnement } from '@/types/abonnement'

export const parentApi = {
  relierEnfant: (data: RelierEnfantRequest) =>
    apiClient.post<CompteEleveResponse>('/api/parent/enfants', data).then((r) => r.data),

  mesEnfants: () =>
    apiClient.get<CompteEleveResponse[]>('/api/parent/enfants').then((r) => r.data),

  delierEnfant: (eleveId: string) => apiClient.delete<void>(`/api/parent/enfants/${eleveId}`),

  suiviEnfant: (eleveId: string) =>
    apiClient.get<EleveSuiviResponse>(`/api/parent/enfants/${eleveId}/suivi`).then((r) => r.data),

  progressionEnfant: (eleveId: string) =>
    apiClient
      .get<ProgressionMatiereResponse[]>(`/api/parent/enfants/${eleveId}/progression`)
      .then((r) => r.data),

  consulterConsentement: (eleveId: string) =>
    apiClient
      .get<ConsentementResponse>(`/api/parent/enfants/${eleveId}/consentement`)
      .then((r) => r.data),

  mettreAJourConsentement: (eleveId: string, data: ConsentementRequest) =>
    apiClient
      .put<ConsentementResponse>(`/api/parent/enfants/${eleveId}/consentement`, data)
      .then((r) => r.data),

  exporterDonneesEnfant: (eleveId: string) =>
    apiClient
      .get<DonneesEleveExportResponse>(`/api/parent/enfants/${eleveId}/export-donnees`)
      .then((r) => r.data),

  monAbonnement: () =>
    apiClient.get<Abonnement[]>('/api/parent/abonnement').then((r) => r.data),
}
