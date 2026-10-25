export interface CompteEleveResponse {
  id: string
  nom: string
  prenom: string
  email: string
  niveauScolaire: string
  actif: boolean
}

export interface CompteEnseignantResponse {
  id: string
  nom: string
  prenom: string
  email: string
  matiere: string
  actif: boolean
}

export interface CreerEleveParAdminRequest {
  nom: string
  prenom: string
  email: string
  motDePasse: string
  niveauScolaire: string
}

export interface CreerEnseignantParAdminRequest {
  nom: string
  prenom: string
  email: string
  motDePasse: string
  matiere: string
}

/** Champs utiles d'Utilisateur tels que retournes par les endpoints Superadmin. */
export interface UtilisateurAdmin {
  id: string
  nom: string
  prenom: string
  email: string
  role: string
  actif: boolean
  dateCreation: string
}
export interface UtilisateurListe {
  id: string
  prenom: string
  nom: string
  email: string
  role: string
  actif: boolean
  dateInscription: string
  derniereActivite: string | null
  nombreExercices: number
}

export interface ExerciceListe {
  id: string
  eleveId: string | null
  eleveNomComplet: string
  dateCreation: string
  matiere?: string
  statut?: string
}
