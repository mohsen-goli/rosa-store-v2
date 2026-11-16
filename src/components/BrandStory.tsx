import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function BrandStory() {
  const { t, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="grid lg:grid-cols-2 gap-5 bg-white rounded-3xl border border-ink-100 overflow-hidden">
        <div className="relative min-h-80 lg:min-h-115">
          <img src="https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-brand-800/50 to-transparent" />
        </div>
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-500 mb-3">{t('home.storyTag')}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4" style={{fontFamily:'var(--font-serif)'}}>{t('home.storyTitle')}</h2>
          <p className="text-ink-500 leading-relaxed mb-6">{t('home.storyDesc')}</p>
          <Link to="/shop" className="self-start group bg-brand-500 hover:bg-brand-600 text-white px-6 h-12 rounded-full font-bold flex items-center gap-2 hover:gap-3 transition-all">
            {t('home.storyCta')}
            <Arrow className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
