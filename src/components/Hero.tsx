import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'

const slides = [
  {
    tagKey: 'home.hero.tag',
    titleKey: 'home.hero.title',
    descKey: 'home.hero.desc',
    ctaKey: 'home.hero.cta',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=80',
    link: '/shop',
    bg: 'from-brand-600 via-brand-700 to-brand-800',
  },
  {
    tagKey: 'nav.perfume',
    titleKey: 'home.storyTitle',
    descKey: 'home.storyDesc',
    ctaKey: 'home.storyCta',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80',
    link: '/shop/perfume',
    bg: 'from-brand-700 via-brand-800 to-black',
  },
  {
    tagKey: 'nav.makeup',
    titleKey: 'home.bestTitle',
    descKey: 'home.bestSub',
    ctaKey: 'action.viewAll',
    image: 'https://images.unsplash.com/photo-1512207128146-4a7f44b65e44?auto=format&fit=crop&w=1400&q=80',
    link: '/shop/makeup',
    bg: 'from-brand-500 via-brand-600 to-brand-800',
  },
]

export default function Hero() {
  const { t, dir } = useI18n()
  const nav = useNavigate()
  const [i, setI] = useState(0)
  useEffect(() => {
    const tm = setInterval(() => setI(v => (v + 1) % slides.length), 7000)
    return () => clearInterval(tm)
  }, [])
  const s = slides[i]
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${s.bg} text-white min-h-[380px] md:min-h-[460px] transition-all duration-700`}>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.8), transparent 40%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4), transparent 50%)'}} />
        <div className="relative p-8 md:p-14 flex flex-col justify-center h-full md:max-w-[55%]">
          <div className="inline-flex self-start items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs mb-5 border border-white/20">
            <span className="w-1.5 h-1.5 bg-brand-200 rounded-full animate-pulse" />
            {t(s.tagKey)}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] mb-5 whitespace-pre-line" style={{fontFamily:'var(--font-serif)'}}>{t(s.titleKey)}</h1>
          <p className="text-white/80 text-sm md:text-base mb-8 max-w-md leading-relaxed">{t(s.descKey)}</p>
          <button onClick={() => nav(s.link)} className="self-start group bg-white text-brand-700 px-7 h-12 rounded-full font-bold flex items-center gap-2 hover:gap-3 transition-all shadow-xl shadow-black/20">
            {t(s.ctaKey)}
            <Arrow className="w-4 h-4 transition" />
          </button>
        </div>
        <img
          src={s.image}
          alt=""
          className="absolute top-0 h-full w-[55%] object-cover opacity-80 mix-blend-luminosity md:mix-blend-normal float-slow hidden md:block"
          style={{
            [dir === 'rtl' ? 'left' : 'right']: 0,
            maskImage: dir === 'rtl'
              ? 'linear-gradient(to right, black 60%, transparent)'
              : 'linear-gradient(to left, black 60%, transparent)',
          } as React.CSSProperties}
        />

        <div className="absolute bottom-6 end-8 flex gap-2 z-10">
          {slides.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
