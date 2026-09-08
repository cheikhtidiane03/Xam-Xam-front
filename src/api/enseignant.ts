import { apiClient } from './client'
import type { StatistiquesClasseResponse, EleveStatNominativeResponse } from '@/types/etablissement'
import type { ExerciceTypeResponse, CreerExerciceTypeRequest } from '@/types/exercice'

export const enseignantApi = {
  statistiques: () =>
    apiClient.get<StatistiquesClasseResponse>('/api/enseignant/statistiques').then((r) => r.data),

  statistiquesNominatives: () =>
    apiClient
      .get<EleveStatNominativeResponse[]>('/api/enseignant/statistiques/nominatives')
      .then((r) => r.data),

  ajouterExerciceType: (data: CreerExerciceTypeRequest) =>
    apiClient.post<ExerciceTypeResponse>('/api/enseignant/bibliotheque', data).then((r) => r.data),

  parcourirBibliotheque: (matiere?: string, niveau?: string) =>
    apiClient
      .get<ExerciceTypeResponse[]>('/api/enseignant/bibliotheque', { params: { matiere, niveau } })
      .then((r) => r.data),
}
