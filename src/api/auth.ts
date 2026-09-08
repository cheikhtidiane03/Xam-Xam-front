import { apiClient } from './client'
import type {
  AuthResponse, LoginRequest, RegisterRequest,
  MotDePasseOublieRequest, ReinitialiserMotDePasseRequest, VerifierEmailRequest,
} from '@/types/auth'

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),

  logout: () => apiClient.post<void>('/api/auth/logout'),

  motDePasseOublie: (data: MotDePasseOublieRequest) =>
    apiClient.post<void>('/api/auth/mot-de-passe-oublie', data).then((r) => r.data),

  reinitialiserMotDePasse: (data: ReinitialiserMotDePasseRequest) =>
    apiClient.post<void>('/api/auth/reinitialiser-mot-de-passe', data).then((r) => r.data),

  verifierEmail: (data: VerifierEmailRequest) =>
    apiClient.post<void>('/api/auth/verifier-email', data).then((r) => r.data),
}
