import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, ShieldCheck, Star, Truck, Loader2 } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { formatPrice, discounted, localizeDigits } from '../lib/utils'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { products, getProduct, addToCart, toggleWish, isWished, loadingProducts } = useStore()
  const { t, lang } = useI18n()
  const p = getProduct(id!)
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState(0)

  if (loadingProducts && !p) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
      </div>
    )
  }

  if (!p) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-ink-500">404 — Product not found</p>
      <Link to="/shop" className="text-brand-500 mt-3 inline-block">{t('action.continueShop')}</Link>
    </div>
  )

  const final = discounted(p.price, p.discount)
  const wished = isWished(p.id)
  const outOfStock = p.stock <= 0
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <nav className="text-xs text-ink-500 mb-5 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600">{t('nav.home')}</Link> ·
        <Link to="/shop" className="hover:text-brand-600">{t('nav.shop')}</Link> ·
        <Link to={`/shop/${p.category}`} className="hover:text-brand-600">{t(`nav.${p.category}`)}</Link>
      </nav>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 bg-white border border-ink-100 rounded-3xl p-6 md:p-8">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-sand to-white border border-ink-100">
            <img src={p.images[img]} alt={p.title[lang]} className="w-full h-full object-cover" />
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {p.images.map((src, k) => (
                <button key={k} onClick={() => setImg(k)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${k === img ? 'border-brand-500' : 'border-ink-100'}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-brand-600 font-bold">{p.brand}</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900 mt-2 leading-snug" style={{fontFamily:'var(--font-serif)'}}>{p.title[lang]}</h1>

          <div className="flex items-center gap-3 mt-3 text-sm">
            <span className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-amber-400" /> {localizeDigits(p.rating, lang)}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${outOfStock ? 'bg-ink-100 text-ink-500' : 'bg-emerald-100 text-emerald-700'}`}>
              {outOfStock ? t('product.outStock') : `${t('product.inStock')} · ${localizeDigits(p.stock, lang)}`}
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            {p.discount && (
              <span className="text-sm text-ink-300 line-through">{formatPrice(p.price, lang)}</span>
            )}
            <span className="text-3xl font-extrabold text-ink-900">{formatPrice(final, lang)}</span>
            <span className="text-sm text-ink-500 mb-1">{t('action.toman')}</span>
            {p.discount && (
              <span className="ms-auto bg-brand-500 text-white text-xs px-2 py-1 rounded-full font-bold">{localizeDigits(p.discount, lang)}% {t('action.off')}</span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-sand rounded-full p-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white border border-ink-100 grid place-items-center" aria-label="minus"><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-8 text-center font-bold">{localizeDigits(qty, lang)}</span>
              <button onClick={() => setQty(q => Math.min(p.stock, q + 1))} className="w-8 h-8 rounded-full bg-white border border-ink-100 grid place-items-center" aria-label="plus"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <button
              disabled={outOfStock}
              onClick={() => { addToCart(p.id, qty) }}
              className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white font-bold h-12 rounded-full transition"
            >
              {t('action.addCart')}
            </button>
            <button
              onClick={() => toggleWish(p.id)}
              className={`w-12 h-12 rounded-full border grid place-items-center transition ${wished ? 'bg-brand-50 border-brand-200 text-brand-500' : 'border-ink-100 hover:bg-sand'}`}
              aria-label={t('action.wishlist')}
            >
              <Heart className={`w-4 h-4 ${wished ? 'fill-brand-500' : ''}`} />
            </button>
          </div>

          <button
            disabled={outOfStock}
            onClick={() => { addToCart(p.id, qty); nav('/checkout') }}
            className="mt-3 bg-ink-900 hover:bg-ink-700 disabled:bg-ink-300 text-white font-bold h-12 rounded-full transition"
          >
            {t('action.buy')}
          </button>

          <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-sand rounded-xl p-3"><Truck className="w-4 h-4 text-brand-500" /> {t('service.ship')}</div>
            <div className="flex items-center gap-2 bg-sand rounded-xl p-3"><ShieldCheck className="w-4 h-4 text-brand-500" /> {t('service.auth')}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <h3 className="font-extrabold mb-3" style={{fontFamily:'var(--font-serif)'}}>{t('product.desc')}</h3>
          <p className="text-sm text-ink-500 leading-relaxed">{t('product.descBody')}</p>
        </div>
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <h3 className="font-extrabold mb-3" style={{fontFamily:'var(--font-serif)'}}>{t('product.features')}</h3>
          <ul className="text-sm text-ink-700 space-y-2">
            <li>• {t('product.f1')}</li>
            <li>• {t('product.f2')}</li>
            <li>• {t('product.f3')}</li>
            <li>• {t('product.f4')}</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-extrabold mb-4" style={{fontFamily:'var(--font-serif)'}}>{t(`nav.${p.category}`)}</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {related.map(r => <ProductCard key={r.id} p={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}
