import { Heart, Star, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../data'
import { useI18n } from '../i18n'
import { useStore } from '../store'
import { formatPrice, discounted, localizeDigits } from '../lib/utils'

export default function ProductCard({ p }: { p: Product }) {
  const { lang, t } = useI18n()
  const { addToCart, toggleWish, isWished } = useStore()
  const final = discounted(p.price, p.discount)
  const wished = isWished(p.id)
  const outOfStock = p.stock <= 0

  return (
    <div className="group relative bg-white rounded-2xl border border-ink-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/40 transition-all overflow-hidden flex flex-col min-w-[210px] w-[210px]">
      {p.badge && (
        <span className="absolute top-3 start-3 z-10 bg-ink-900 text-white text-[10px] px-2 py-1 rounded-full font-semibold capitalize">{p.badge}</span>
      )}
      {p.discount && (
        <span className="absolute top-3 end-3 z-10 bg-brand-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          {localizeDigits(p.discount, lang)}% {t('action.off')}
        </span>
      )}

      <button
        onClick={() => toggleWish(p.id)}
        className={`absolute top-12 end-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-ink-100 grid place-items-center transition ${wished ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        aria-label="wishlist"
      >
        <Heart className={`w-4 h-4 ${wished ? 'fill-brand-500 text-brand-500' : 'text-ink-700'}`} />
      </button>

      <Link to={`/product/${p.id}`} className="aspect-square bg-gradient-to-br from-sand to-white overflow-hidden block">
        <img src={p.images[0]} alt={p.title[lang]} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      </Link>

      <div className="p-3.5 flex-1 flex flex-col gap-2">
        <div className="text-[11px] text-brand-600 font-semibold">{p.brand}</div>
        <Link to={`/product/${p.id}`} className="text-[13px] text-ink-900 font-semibold leading-snug line-clamp-2 min-h-[36px] hover:text-brand-600">
          {p.title[lang]}
        </Link>
        <div className="flex items-center gap-1 text-[11px] text-ink-500">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{localizeDigits(p.rating, lang)}</span>
        </div>
        <div className="mt-auto pt-2 border-t border-dashed border-ink-100 flex items-end justify-between gap-2">
          <div>
            {p.discount && (
              <div className="text-[11px] text-ink-300 line-through">{formatPrice(p.price, lang)}</div>
            )}
            <div className="text-sm font-extrabold text-ink-900">
              {formatPrice(final, lang)} <span className="text-[10px] font-normal text-ink-500">{t('action.toman')}</span>
            </div>
          </div>
          <button
            disabled={outOfStock}
            onClick={() => addToCart(p.id, 1)}
            className="w-9 h-9 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white grid place-items-center transition"
            aria-label={t('action.addCart')}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
