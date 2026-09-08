import { useAuthStore } from '@/stores/authStore'

/** Raccourci pratique pour lire l'etat d'auth courant dans les composants. */
export function useAuth() {
  const { token, email, nom, prenom, role, emailVerifie, isAuthenticated, setSession, clearSession } =
    useAuthStore()

  return {
    token,
    email,
    nom,
    prenom,
    role,
    emailVerifie,
    estConnecte: isAuthenticated(),
    setSession,
    clearSession,
  }
}
