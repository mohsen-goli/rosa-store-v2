import { useI18n } from '../i18n'
import { articles } from '../data'
import { Clock, UserCircle2 } from 'lucide-react'

export default function Magazine() {
  const { t, lang } = useI18n()
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-ink-900 mb-2" style={{fontFamily:'var(--font-serif)'}}>{t('home.magTitle')}</h1>
      <p className="text-ink-500 text-sm mb-8">{t('home.magSub')}</p>
      <div className="grid md:grid-cols-3 gap-4">
        {articles[lang].map(a => (
          <article key={a.id} className="bg-white rounded-2xl overflow-hidden border border-ink-100">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-ink-900 leading-snug">{a.title}</h3>
              <p className="text-[12px] text-ink-500 leading-relaxed">{a.excerpt}</p>
              <div className="flex items-center justify-between text-[11px] text-ink-500 pt-2 border-t border-dashed border-ink-100">
                <span className="flex items-center gap-1"><UserCircle2 className="w-3.5 h-3.5" /> {a.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.read}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
