import axios, { type AxiosError } from 'axios'
import type { ErrorResponse } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Injecte automatiquement le token JWT courant sur chaque requete (lu
// depuis le store d'auth, importe tardivement pour eviter un cycle
// d'import entre apiClient <-> authStore).
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('xaamxaam-auth')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // ignore un state corrompu en localStorage
    }
  }
  return config
})

// Normalise les erreurs pour que le reste de l'app puisse toujours lire
// error.message (message metier renvoye par GlobalExceptionHandler cote
// backend) sans avoir a connaitre la forme exacte de la reponse Axios.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const backendMessage = error.response?.data?.message
    const status = error.response?.status

    if (status === 401) {
      // Token expire/invalide/revoque : on nettoie la session locale.
      // La redirection vers /connexion est geree par ProtectedRoute.
      localStorage.removeItem('xaamxaam-auth')
    }

    const message = backendMessage ?? error.message ?? "Une erreur inattendue est survenue."
    return Promise.reject(new ApiError(message, status, error.response?.data?.details ?? null))
  }
)

export class ApiError extends Error {
  status?: number
  details: string[] | null

  constructor(message: string, status?: number, details: string[] | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}
