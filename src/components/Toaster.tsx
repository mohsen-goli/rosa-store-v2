import { useStore } from '../store'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useI18n } from '../i18n'

export default function Toaster() {
  const { toasts } = useStore()
  const { t } = useI18n()
  return (
    <div className="fixed bottom-6 inset-x-0 z-[60] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(x => {
        const isErr = x.kind === 'error'
        const msg = x.message === 'added' ? t('action.addedCart') : x.message
        return (
          <div
            key={x.id}
            className={`toast-enter pointer-events-auto px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm text-white ${isErr ? 'bg-brand-600' : 'bg-ink-900'}`}
          >
            {isErr
              ? <XCircle className="w-4 h-4 text-amber-300" />
              : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{msg}</span>
          </div>
        )
      })}
    </div>
  )
}
