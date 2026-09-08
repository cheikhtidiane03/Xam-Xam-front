import { Toaster } from 'react-hot-toast'

/**
 * Systeme de notifications "temps reel" pour retour immediat sur les
 * actions (succes/erreur d'appel API, etc). Le backend n'expose pas de
 * flux de notifications push (websocket/SSE) pour l'instant - ceci est
 * donc un systeme purement client, declenche depuis les pages via les
 * helpers dans lib/notify.ts.
 */
export function NotificationProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        className: '!rounded-xl !border !text-sm',
        style: {
          background: 'var(--toast-bg, #fff)',
          color: 'var(--toast-fg, #0f172a)',
          border: '1px solid var(--toast-border, #e2e8f0)',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  )
}
