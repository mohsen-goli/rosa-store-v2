import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Wishlist() {
  const { wishlist, getProduct } = useStore()
  const { t } = useI18n()
  const items = wishlist.map(id => getProduct(id)).filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-6" style={{fontFamily:'var(--font-serif)'}}>{t('action.wishlist')}</h1>
      {items.length === 0 ? (
        <div className="bg-white border border-ink-100 rounded-3xl p-12 text-center">
          <Heart className="w-14 h-14 mx-auto text-ink-300 mb-4" />
          <p className="text-ink-500">{t('cart.empty')}</p>
          <Link to="/shop" className="inline-block mt-4 text-brand-500">{t('cart.emptyCta')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {items.map(p => (
            <div key={p!.id} className="[&>div]:!w-full [&>div]:!min-w-0"><ProductCard p={p!} /></div>
          ))}
        </div>
      )}
    </div>
  )
}
