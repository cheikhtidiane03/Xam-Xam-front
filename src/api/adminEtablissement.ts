import { apiClient } from './client'
import type { StatistiquesClasseResponse, EleveStatNominativeResponse } from '@/types/etablissement'
import type {
  CompteEleveResponse, CompteEnseignantResponse,
  CreerEleveParAdminRequest, CreerEnseignantParAdminRequest,
} from '@/types/compte'

export const adminEtablissementApi = {
  statistiques: () =>
    apiClient.get<StatistiquesClasseResponse>('/api/admin-etablissement/statistiques').then((r) => r.data),

  statistiquesNominatives: () =>
    apiClient
      .get<EleveStatNominativeResponse[]>('/api/admin-etablissement/statistiques/nominatives')
      .then((r) => r.data),

  creerEleve: (data: CreerEleveParAdminRequest) =>
    apiClient.post<CompteEleveResponse>('/api/admin-etablissement/eleves', data).then((r) => r.data),

  listerEleves: () =>
    apiClient.get<CompteEleveResponse[]>('/api/admin-etablissement/eleves').then((r) => r.data),

  desactiverEleve: (eleveId: string) =>
    apiClient.post<void>(`/api/admin-etablissement/eleves/${eleveId}/desactiver`),

  reactiverEleve: (eleveId: string) =>
    apiClient.post<void>(`/api/admin-etablissement/eleves/${eleveId}/reactiver`),

  creerEnseignant: (data: CreerEnseignantParAdminRequest) =>
    apiClient
      .post<CompteEnseignantResponse>('/api/admin-etablissement/enseignants', data)
      .then((r) => r.data),

  listerEnseignants: () =>
    apiClient.get<CompteEnseignantResponse[]>('/api/admin-etablissement/enseignants').then((r) => r.data),

  desactiverEnseignant: (enseignantId: string) =>
    apiClient.post<void>(`/api/admin-etablissement/enseignants/${enseignantId}/desactiver`),

  reactiverEnseignant: (enseignantId: string) =>
    apiClient.post<void>(`/api/admin-etablissement/enseignants/${enseignantId}/reactiver`),
}
