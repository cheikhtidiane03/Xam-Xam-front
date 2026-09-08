import { apiClient } from './client'
import type {
  ExerciceResponse, ExerciceRequest, TentativeRequest, TentativeResponse,
  IndiceResponse, ReformulationRequest, ReformulationResponse,
  EleveSuiviResponse, ProgressionMatiereResponse, BadgeResponse,
  ExerciceTypeResponse, OcrResponse, CodeLiaisonResponse,
} from '@/types/exercice'
import type { DonneesEleveExportResponse } from '@/types/conformite'

export const eleveApi = {
  extraireTexteOcr: (image: File) => {
    const form = new FormData()
    form.append('image', image)
    return apiClient
      .post<OcrResponse>('/api/eleve/ocr', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },

  creerExercice: (data: ExerciceRequest) =>
    apiClient.post<ExerciceResponse>('/api/eleve/exercices', data).then((r) => r.data),

  creerExerciceDepuisBibliotheque: (exerciceTypeId: string) =>
    apiClient
      .post<ExerciceResponse>(`/api/eleve/exercices/depuis-bibliotheque/${exerciceTypeId}`)
      .then((r) => r.data),

  listerExercices: () =>
    apiClient.get<ExerciceResponse[]>('/api/eleve/exercices').then((r) => r.data),

  recupererExercice: (exerciceId: string) =>
    apiClient.get<ExerciceResponse>(`/api/eleve/exercices/${exerciceId}`).then((r) => r.data),

  soumettreTentative: (exerciceId: string, data: TentativeRequest) =>
    apiClient
      .post<TentativeResponse>(`/api/eleve/exercices/${exerciceId}/tentatives`, data)
      .then((r) => r.data),

  debloquerIndiceSuivant: (exerciceId: string) =>
    apiClient
      .post<IndiceResponse>(`/api/eleve/exercices/${exerciceId}/indices/suivant`)
      .then((r) => r.data),

  soumettreReformulation: (exerciceId: string, data: ReformulationRequest) =>
    apiClient
      .post<ReformulationResponse>(`/api/eleve/exercices/${exerciceId}/reformulation`, data)
      .then((r) => r.data),

  monTableauDeBord: () =>
    apiClient.get<EleveSuiviResponse>('/api/eleve/tableau-de-bord').then((r) => r.data),

  maProgression: () =>
    apiClient.get<ProgressionMatiereResponse[]>('/api/eleve/progression').then((r) => r.data),

  mesBadges: () =>
    apiClient.get<BadgeResponse[]>('/api/eleve/badges').then((r) => r.data),

  parcourirBibliotheque: (matiere?: string, niveau?: string) =>
    apiClient
      .get<ExerciceTypeResponse[]>('/api/eleve/bibliotheque', { params: { matiere, niveau } })
      .then((r) => r.data),

  exporterMesDonnees: () =>
    apiClient.get<DonneesEleveExportResponse>('/api/eleve/mes-donnees').then((r) => r.data),

  supprimerMonCompte: () => apiClient.delete<void>('/api/eleve/mon-compte'),

  quotaIaRestant: () =>
    apiClient.get<number>('/api/eleve/quota-ia-restant').then((r) => r.data),

  genererCodeLiaisonParent: () =>
    apiClient.get<CodeLiaisonResponse>('/api/eleve/code-liaison-parent').then((r) => r.data),
}
