export type TypeEtablissement = 'COLLEGE' | 'LYCEE' | 'COLLEGE_LYCEE'

export interface EtablissementResponse {
  id: string
  nom: string
  type: TypeEtablissement
  licenceActive: boolean
  dateExpirationLicence: string | null
  enAttenteValidation: boolean
}

export interface EtablissementRequest {
  nom: string
  type: TypeEtablissement
  adresse?: string | null
}

export interface StatistiquesClasseResponse {
  nombreEleves: number
  nombreExercicesTraites: number
  tauxReformulationAtteinte: number
  scoreMoyenReformulation: number
}

export interface EleveStatNominativeResponse {
  eleveId: string
  nomComplet: string
  nombreExercicesTermines: number
  scoreMoyenReformulation: number
}

export interface VueGlobaleResponse {
  nombreUtilisateursTotal: number
  nombreElevesActifs: number
  nombreEtablissementsValides: number
  nombreEtablissementsEnAttente: number
  nombreExercicesAujourdHui: number
}

export interface SignalementContournementResponse {
  id: string
  eleveId: string
  eleveNomComplet: string
  exerciceId: string | null
  type: 'COPIE_ENONCE' | 'REPONSE_ANORMALEMENT_LONGUE' | 'RAPIDITE_SUSPECTE'
  details: string
  traite: boolean
  dateCreation: string
}
