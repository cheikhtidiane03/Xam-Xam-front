export type StatutExercice = 'EN_COURS' | 'REFORMULATION_EN_ATTENTE' | 'TERMINE' | 'ABANDONNE'

export interface ExerciceResponse {
  id: string
  enonce: string
  matiere: string
  niveau: string
  statut: StatutExercice
  dateCreation: string
}

export interface ExerciceRequest {
  enonce: string
  matiere: string
  niveau: string
  sourceImageUrl?: string | null
}

export interface TentativeRequest {
  contenu: string
}

export interface TentativeResponse {
  tentativeId: string
  relanceIa: string
  indiceNiveauActuel: number
  dateHeure: string
}

export interface IndiceResponse {
  id: string
  niveau: number
  contenu: string
}

export interface ReformulationRequest {
  texte: string
}

export interface ReformulationResponse {
  id: string
  texte: string
  score: number
  feedbackIa: string
}

export interface EleveSuiviResponse {
  eleveId: string
  nomComplet: string
  nombreExercicesTermines: number
  nombreExercicesEnCours: number
  nombreTentativesTotal: number
  scoreMoyenReformulation: number
  tempsReflexionMoyenMinutes: number
}

export interface ProgressionMatiereResponse {
  matiere: string
  nombreExercicesTermines: number
  nombreExercicesEnCours: number
  scoreMoyenReformulation: number
}

export interface BadgeResponse {
  code: string
  nom: string
  description: string
  dateObtention: string
}

export interface ExerciceTypeResponse {
  id: string
  titre: string
  enonce: string
  matiere: string
  niveau: string
}

export interface CreerExerciceTypeRequest {
  titre: string
  enonce: string
  matiere: string
  niveau: string
}

export interface OcrResponse {
  texteExtrait: string
}

export interface CodeLiaisonResponse {
  code: string
  dateExpiration: string
}
