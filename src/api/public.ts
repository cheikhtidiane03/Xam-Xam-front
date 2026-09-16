import { apiClient } from './client'
import type { EtablissementPublicResponse } from '@/types/etablissement'

/** Endpoints accessibles sans authentification (avant connexion). */
export const publicApi = {
  listerEtablissements: () =>
    apiClient.get<EtablissementPublicResponse[]>('/api/public/etablissements').then((r) => r.data),
}