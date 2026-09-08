import { ApiError } from '@/api/client'

/** Extrait un message affichable depuis n'importe quelle erreur attrapee. */
export function messageErreur(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return "Une erreur inattendue est survenue."
}
