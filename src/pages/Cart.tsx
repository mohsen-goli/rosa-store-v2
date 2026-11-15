import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { formatPrice, discounted, localizeDigits } from '../lib/utils'

export default function Cart() {
  const { cart, setQty, removeFromCart, cartSubtotal, getProduct } = useStore()
  const { t, lang } = useI18n()
  const nav = useNavigate()
  const shipping = cartSubtotal >= 500_000 ? 0 : 45_000
  const total = cartSubtotal > 0 ? cartSubtotal + shipping : 0

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-14 h-14 mx-auto text-ink-300 mb-4" />
        <h1 className="text-xl font-extrabold text-ink-900">{t('cart.empty')}</h1>
        <Link to="/shop" className="inline-block mt-5 bg-brand-500 hover:bg-brand-600 text-white px-6 h-11 rounded-full font-bold leading-[2.75rem]">
          {t('cart.emptyCta')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
      <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-6" style={{fontFamily:'var(--font-serif)'}}>{t('cart.title')}</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          {cart.map(item => {
            const p = getProduct(item.productId)
            if (!p) return null
            const unit = discounted(p.price, p.discount)
            return (
              <div key={item.productId} className="flex items-center gap-4 p-4 border-b border-ink-100 last:border-0">
                <Link to={`/product/${p.id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-sand shrink-0">
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-brand-600 font-semibold">{p.brand}</div>
                  <Link to={`/product/${p.id}`} className="block font-semibold text-sm text-ink-900 line-clamp-2 hover:text-brand-600">{p.title[lang]}</Link>
                  <div className="text-sm font-bold mt-1">{formatPrice(unit, lang)} <span className="text-[10px] text-ink-500 font-normal">{t('action.toman')}</span></div>
                </div>
                <div className="flex items-center gap-2 bg-sand rounded-full p-1">
                  <button onClick={() => setQty(p.id, item.qty - 1)} className="w-7 h-7 rounded-full bg-white border border-ink-100 grid place-items-center"><Minus className="w-3 h-3" /></button>
                  <span className="w-7 text-center text-sm font-bold">{localizeDigits(item.qty, lang)}</span>
                  <button disabled={item.qty >= p.stock} onClick={() => setQty(p.id, item.qty + 1)} className="w-7 h-7 rounded-full bg-white border border-ink-100 grid place-items-center disabled:opacity-50"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => removeFromCart(p.id)} className="w-9 h-9 rounded-full hover:bg-sand grid place-items-center text-ink-500 hover:text-brand-500" aria-label={t('action.remove')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        <aside className="bg-white border border-ink-100 rounded-2xl p-5 h-max sticky top-28">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-500">{t('cart.subtotal')}</span><span className="font-bold">{formatPrice(cartSubtotal, lang)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">{t('cart.shipping')}</span><span className="font-bold">{shipping === 0 ? t('cart.free') : formatPrice(shipping, lang)}</span></div>
            <div className="border-t border-ink-100 pt-3 flex justify-between items-end">
              <span className="text-ink-500">{t('cart.total')}</span>
              <span className="font-extrabold text-lg text-brand-600">{formatPrice(total, lang)} <span className="text-[10px] text-ink-500 font-normal">{t('action.toman')}</span></span>
            </div>
          </div>
          <button onClick={() => nav('/checkout')} className="mt-5 w-full bg-brand-500 hover:bg-brand-600 text-white font-bold h-12 rounded-full transition">
            {t('action.checkout')}
          </button>
          <Link to="/shop" className="mt-3 block text-center text-sm text-ink-500 hover:text-brand-600">{t('action.continueShop')}</Link>
        </aside>
      </div>
    </div>
  )
}
