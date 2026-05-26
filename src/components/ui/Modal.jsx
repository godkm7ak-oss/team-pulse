import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, danger = false }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-navy-800 border border-white/10 rounded-3xl shadow-modal animate-scale-in">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 className={`font-heading font-semibold text-lg ${danger ? 'text-red-400' : ''}`}>{title}</h3>
          <button onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:text-white active:scale-95 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'ยืนยัน', danger = false, loading = false, children }) {
  return (
    <Modal open={open} onClose={onClose} title={title} danger={danger}>
      <p className="text-white/60 text-sm mb-4 leading-relaxed">{message}</p>
      {children}
      <div className={`flex gap-3 ${children ? 'mt-4' : ''}`}>
        <button onClick={onClose}
                className="flex-1 btn-secondary text-sm py-3">
          ยกเลิก
        </button>
        <button onClick={onConfirm} disabled={loading}
                className={`flex-1 font-semibold rounded-2xl px-4 py-3 text-sm active:scale-[0.97] transition-all
                            disabled:opacity-50 flex items-center justify-center gap-2
                            ${danger ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-primary'}`}>
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
