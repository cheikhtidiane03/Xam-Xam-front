import { useCallback, useEffect, useState } from 'react'
import { messageErreur } from './useApiError'

interface UseFetchState<T> {
  donnees: T | null
  chargement: boolean
  erreur: string | null
  recharger: () => void
}

/**
 * Hook de fetch minimal (pas de cache/dedupe avance type react-query,
 * volontairement simple vu la taille du projet). `deps` redeclenche le
 * fetch quand ses valeurs changent (ex: un id dans l'URL).
 */
export function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []): UseFetchState<T> {
  const [donnees, setDonnees] = useState<T | null>(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const charger = useCallback(() => {
    setChargement(true)
    setErreur(null)
    fn()
      .then((res) => setDonnees(res))
      .catch((err) => setErreur(messageErreur(err)))
      .finally(() => setChargement(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  useEffect(() => {
    charger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charger])

  return { donnees, chargement, erreur, recharger: () => setTick((t) => t + 1) }
}
