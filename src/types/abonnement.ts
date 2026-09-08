export type TypeAbonnement = 'PARENT' | 'ETABLISSEMENT'
export type StatutAbonnement = 'ACTIF' | 'EXPIRE' | 'EN_ATTENTE' | 'ANNULE'

export interface Abonnement {
  id: string
  type: TypeAbonnement
  dateDebut: string
  dateFin: string | null
  statut: StatutAbonnement
  montantFcfa: number | null
}
