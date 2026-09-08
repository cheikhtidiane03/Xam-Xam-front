import { useEffect } from 'react'
import { useThemeStore, appliquerTheme } from '@/stores/themeStore'

export function useTheme() {
  const { preference, setPreference, toggle } = useThemeStore()

  // Reagit aux changements de preference systeme quand preference === 'system'.
  useEffect(() => {
    if (preference !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => appliquerTheme('system')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [preference])

  return { preference, setPreference, toggle }
}
