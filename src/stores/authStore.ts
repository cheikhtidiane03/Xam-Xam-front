import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, Role } from '@/types/auth'

interface AuthState {
  token: string | null
  email: string | null
  nom: string | null
  prenom: string | null
  role: Role | null
  emailVerifie: boolean

  isAuthenticated: () => boolean
  setSession: (auth: AuthResponse) => void
  clearSession: () => void
}

/**
 * Persiste dans localStorage sous la cle "xaamxaam-auth" - c'est CETTE
 * meme cle que lit apiClient (voir api/client.ts) pour injecter le token
 * sur chaque requete, sans creer de dependance circulaire entre les deux
 * modules.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      nom: null,
      prenom: null,
      role: null,
      emailVerifie: false,

      isAuthenticated: () => get().token !== null,

      setSession: (auth) =>
        set({
          token: auth.token,
          email: auth.email,
          nom: auth.nom,
          prenom: auth.prenom,
          role: auth.role,
          emailVerifie: auth.emailVerifie,
        }),

      clearSession: () =>
        set({ token: null, email: null, nom: null, prenom: null, role: null, emailVerifie: false }),
    }),
    { name: 'xaamxaam-auth' }
  )
)
