import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'light' | 'dark' | 'system'

interface ThemeState {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
  toggle: () => void
}

function resoudEstSombre(preference: ThemePreference): boolean {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return preference === 'dark'
}

/** Applique/retire la classe .dark sur <html> - c'est ce qui pilote tous
 * les utilitaires dark: de Tailwind (voir @custom-variant dans index.css). */
export function appliquerTheme(preference: ThemePreference) {
  const estSombre = resoudEstSombre(preference)
  document.documentElement.classList.toggle('dark', estSombre)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: 'system',

      setPreference: (preference) => {
        appliquerTheme(preference)
        set({ preference })
      },

      toggle: () => {
        const actuel = get().preference
        const estSombreActuellement = resoudEstSombre(actuel)
        const nouvelle: ThemePreference = estSombreActuellement ? 'light' : 'dark'
        appliquerTheme(nouvelle)
        set({ preference: nouvelle })
      },
    }),
    {
      name: 'xaamxaam-theme',
      onRehydrateStorage: () => (state) => {
        // Applique le theme sauvegarde des que le store est rehydrate,
        // avant meme le premier rendu visible (evite un flash).
        if (state) appliquerTheme(state.preference)
      },
    }
  )
)
