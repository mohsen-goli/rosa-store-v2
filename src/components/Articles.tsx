import { Link } from 'react-router-dom'
import { Clock, UserCircle2 } from 'lucide-react'
import { articles } from '../data'
import { useI18n } from '../i18n'

export default function Articles() {
  const { t, lang } = useI18n()
  const list = articles[lang]
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-ink-900" style={{fontFamily:'var(--font-serif)'}}>{t('home.magTitle')}</h2>
          <p className="text-ink-500 text-xs mt-1">{t('home.magSub')}</p>
        </div>
        <Link to="/magazine" className="text-brand-500 text-sm hover:text-brand-700">{t('action.viewAll')} →</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {list.map(a => (
          <Link key={a.id} to={`/magazine/${a.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/40 transition">
            <div className="aspect-4/3 overflow-hidden">
              <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-ink-900 leading-snug line-clamp-2 min-h-12 group-hover:text-brand-600 transition">{a.title}</h3>
              <p className="text-[12px] text-ink-500 leading-relaxed line-clamp-2">{a.excerpt}</p>
              <div className="flex items-center justify-between text-[11px] text-ink-500 pt-2 border-t border-dashed border-ink-100">
                <span className="flex items-center gap-1"><UserCircle2 className="w-3.5 h-3.5" /> {a.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.read}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
