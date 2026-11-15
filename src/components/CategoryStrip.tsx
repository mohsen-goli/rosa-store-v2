import { Link } from 'react-router-dom'
import { categoriesMeta } from '../data'
import { useI18n } from '../i18n'

export default function CategoryStrip() {
  const { t } = useI18n()
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-ink-900" style={{fontFamily:'var(--font-serif)'}}>{t('home.categoriesTitle')}</h2>
          <p className="text-ink-500 text-xs mt-1">{t('home.categoriesSub')}</p>
        </div>
        <Link to="/shop" className="text-brand-500 text-sm hover:text-brand-700">{t('action.viewAll')} →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categoriesMeta.map(c => (
          <Link key={c.id} to={`/shop/${c.id}`} className="group relative overflow-hidden rounded-3xl bg-white border border-ink-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/40 transition-all p-6 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${c.color} grid place-items-center text-4xl group-hover:scale-105 transition`}>{c.icon}</div>
            <h3 className="mt-4 font-bold text-ink-900 group-hover:text-brand-600 transition">{t(`nav.${c.id}`)}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
