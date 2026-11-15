import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Product } from '../data'
import { useI18n } from '../i18n'
import { localizeDigits } from '../lib/utils'

function useCountdown(seconds: number) {
  const [t, setT] = useState(seconds)
  useEffect(() => {
    const i = setInterval(() => setT(v => (v > 0 ? v - 1 : seconds)), 1000)
    return () => clearInterval(i)
  }, [seconds])
  return t
}

export default function FlashDeals({ products }: { products: Product[] }) {
  const { t, lang, dir } = useI18n()
  const left = useCountdown(8 * 3600)
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  const pad = (n: number) => localizeDigits(String(n).padStart(2, '0'), lang)
  const clock = `${pad(h)}:${pad(m)}:${pad(s)}`

  const scroller = useRef<HTMLDivElement>(null)
  const scroll = (forward: boolean) => {
    const el = scroller.current; if (!el) return
    const sign = (dir === 'rtl' ? -1 : 1) * (forward ? 1 : -1)
    el.scrollBy({ left: sign * 600, behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 10% 50%, rgba(255,255,255,0.4), transparent 40%)'}} />
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/15">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold" style={{fontFamily:'var(--font-serif)'}}>{t('home.dealsTitle')}</h2>
              <p className="text-xs opacity-80 mt-0.5">{t('home.dealsSub')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm font-bold border border-white/20" dir="ltr">
              <span className="w-2 h-2 bg-amber-300 rounded-full animate-pulse"></span>
              {clock}
            </div>
            <button onClick={() => scroll(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"><ChevronRight className="w-4 h-4" /></button>
            <button onClick={() => scroll(true)}  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"><ChevronLeft className="w-4 h-4" /></button>
          </div>
        </div>
        <div ref={scroller} className="relative flex gap-3 p-5 overflow-x-auto no-scrollbar">
          {products.map(p => <div key={p.id}><ProductCard p={p} /></div>)}
        </div>
      </div>
    </section>
  )
}
