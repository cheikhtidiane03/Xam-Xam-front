// À AJOUTER à la fin de types/compte.ts (garde tout le reste du fichier tel quel)

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
