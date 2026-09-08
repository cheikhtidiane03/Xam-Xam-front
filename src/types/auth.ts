export type Role = 'ELEVE' | 'PARENT' | 'ENSEIGNANT' | 'ADMIN_ETABLISSEMENT' | 'SUPERADMIN'

export interface AuthResponse {
  token: string
  email: string
  nom: string
  prenom: string
  role: Role
  emailVerifie: boolean
}

export interface LoginRequest {
  email: string
  motDePasse: string
}

export interface RegisterRequest {
  nom: string
  prenom: string
  email: string
  motDePasse: string
  role: Role
  etablissementId?: string | null
  niveauScolaire?: string | null
  matiere?: string | null
}

export interface MotDePasseOublieRequest {
  email: string
}

export interface ReinitialiserMotDePasseRequest {
  token: string
  nouveauMotDePasse: string
}

export interface VerifierEmailRequest {
  token: string
}
