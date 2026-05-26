import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function BottomSheet({ open, onClose, title, children, tall = false }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end">
      {/* Backdrop */}
      <div ref={overlayRef}
           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
           onClick={onClose} />

      {/* Sheet */}
      <div className={`relative w-full bg-navy-800 border border-white/10 rounded-t-3xl shadow-modal animate-slide-up
                       ${tall ? 'max-h-[92vh]' : 'max-h-[80vh]'} flex flex-col`}
           style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 pb-3 pt-1 border-b border-white/8">
            <h3 className="font-heading font-semibold text-lg">{title}</h3>
            <button onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:text-white active:scale-95 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
