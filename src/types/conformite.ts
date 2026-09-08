export interface ConsentementRequest {
  consentementDonnees: boolean
  consentementStatistiquesNominatives: boolean
}

export interface ConsentementResponse {
  eleveId: string
  consentementDonnees: boolean
  dateConsentementDonnees: string | null
  consentementStatistiquesNominatives: boolean
  dateConsentementStatistiques: string | null
}

export interface DonneesEleveExportResponse {
  eleveId: string
  nom: string
  prenom: string
  email: string
  niveauScolaire: string
  dateCreationCompte: string
  exercices: Array<{
    id: string
    enonce: string
    matiere: string
    statut: string
    dateCreation: string
    tentatives: string[]
    reformulationTexte: string | null
    reformulationScore: number | null
  }>
}

export interface RelierEnfantRequest {
  code: string
}
