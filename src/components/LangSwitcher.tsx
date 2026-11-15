import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { LANGS, useI18n } from '../i18n'

export default function LangSwitcher() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  const current = LANGS.find(l => l.code === lang)!
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="h-10 px-3 rounded-full hover:bg-sand flex items-center gap-2 text-sm text-ink-700"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span>{current.flag} {current.label}</span>
      </button>
      {open && (
        <div className="absolute top-12 end-0 min-w-[160px] bg-white rounded-xl border border-ink-100 shadow-xl py-1 z-50 fade-up">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-sand"
            >
              <span className="flex items-center gap-2">{l.flag} {l.label}</span>
              {l.code === lang && <Check className="w-4 h-4 text-brand-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
