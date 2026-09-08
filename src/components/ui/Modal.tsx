import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  ouvert: boolean
  onFermer: () => void
  titre: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ ouvert, onFermer, titre, children, footer }: ModalProps) {
  useEffect(() => {
    if (!ouvert) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onFermer()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [ouvert, onFermer])

  if (!ouvert) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onFermer} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-ink-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{titre}</h2>
          <button
            onClick={onFermer}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4 dark:border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
