import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-24 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
           style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' }}>
        {toasts.map(t => (
          <div key={t.id}
               className="pointer-events-auto animate-slide-up flex items-start gap-3 rounded-2xl px-4 py-3.5 shadow-modal glass text-sm font-medium">
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />}
            {t.type === 'error'   && <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />}
            {t.type === 'info'    && <AlertCircle className="w-5 h-5 text-primary-300 shrink-0 mt-0.5" />}
            <span className="flex-1 text-white">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="shrink-0 text-white/40 hover:text-white/80">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
