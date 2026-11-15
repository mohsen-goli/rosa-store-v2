import { useMemo, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { type Category, type Product } from '../data'
import ProductCard from '../components/ProductCard'
import { useI18n } from '../i18n'
import { useStore } from '../store'
import { localizeDigits, formatPrice } from '../lib/utils'
import { SlidersHorizontal, Search as SearchIcon, Loader2 } from 'lucide-react'

type SortKey = 'newest' | 'cheapest' | 'expensive' | 'mostRated' | 'mostOff'
const CATS: Category[] = ['skincare', 'makeup', 'perfume', 'haircare']
const PAGE_SIZE = 12

export default function Shop() {
  const { t, lang } = useI18n()
  const { products, loadingProducts } = useStore()
  const { cat } = useParams()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [sort, setSort] = useState<SortKey>('newest')
  const [maxPrice, setMaxPrice] = useState<number>(10_000_000)
  const [visible, setVisible] = useState<number>(PAGE_SIZE)

  const filtered = useMemo(() => {
    let list: Product[] = products.slice()
    if (cat && CATS.includes(cat as Category)) list = list.filter(p => p.category === cat)
    if (q) {
      const needle = q.toLowerCase()
      list = list.filter(p =>
        p.brand.toLowerCase().includes(needle) ||
        p.title.en.toLowerCase().includes(needle) ||
        p.title.fa.includes(q) ||
        p.title.ar.includes(q)
      )
    }
    list = list.filter(p => p.price <= maxPrice)
    const price = (p: Product) => p.discount ? Math.round(p.price * (100 - p.discount) / 100) : p.price
    switch (sort) {
      case 'cheapest':  list.sort((a,b) => price(a) - price(b)); break
      case 'expensive': list.sort((a,b) => price(b) - price(a)); break
      case 'mostRated': list.sort((a,b) => b.rating - a.rating); break
      case 'mostOff':   list.sort((a,b) => (b.discount ?? 0) - (a.discount ?? 0)); break
    }
    return list
  }, [cat, q, sort, maxPrice, products])

  const title = cat ? t(`nav.${cat}`) : t('shop.title')

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900" style={{fontFamily:'var(--font-serif)'}}>
            {q ? `${t('shop.search')} “${q}”` : title}
          </h1>
          <p className="text-ink-500 text-sm mt-1">
            {localizeDigits(filtered.length, lang)} {t('shop.found')}
          </p>
        </div>
        {q && (
          <button onClick={() => setParams({})} className="text-brand-500 text-sm">{t('action.reset')}</button>
        )}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-5">
        <aside className="bg-white border border-ink-100 rounded-2xl p-5 h-max lg:sticky lg:top-28">
          <div className="flex items-center gap-2 font-bold text-sm mb-4"><SlidersHorizontal className="w-4 h-4" /> {t('action.filter')}</div>

          <div>
            <div className="text-xs font-bold text-ink-700 mb-2">{t('shop.cats')}</div>
            <div className="flex flex-col gap-1">
              <Link to="/shop" className={`px-3 py-1.5 rounded-full text-sm ${!cat ? 'bg-brand-500 text-white' : 'hover:bg-sand text-ink-700'}`}>{t('nav.shop')}</Link>
              {CATS.map(c => (
                <Link key={c} to={`/shop/${c}`} className={`px-3 py-1.5 rounded-full text-sm ${cat === c ? 'bg-brand-500 text-white' : 'hover:bg-sand text-ink-700'}`}>
                  {t(`nav.${c}`)}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-bold text-ink-700 mb-2">{t('shop.price')}</div>
            <input type="range" min={100_000} max={10_000_000} step={100_000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full accent-brand-500" />
            <div className="text-xs text-ink-500 mt-1">≤ {formatPrice(maxPrice, lang)} {t('action.toman')}</div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-bold text-ink-700 mb-2">{t('action.sort')}</div>
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="w-full bg-sand border border-ink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400">
              <option value="newest">{t('sort.newest')}</option>
              <option value="cheapest">{t('sort.cheapest')}</option>
              <option value="expensive">{t('sort.expensive')}</option>
              <option value="mostRated">{t('sort.mostRated')}</option>
              <option value="mostOff">{t('sort.mostOff')}</option>
            </select>
          </div>
        </aside>

        <div>
          {loadingProducts && products.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center">
              <SearchIcon className="w-10 h-10 mx-auto text-ink-300 mb-3" />
              <p className="text-ink-700 font-bold">{t('shop.empty')}</p>
              <Link to="/shop" className="inline-block mt-4 text-brand-500">{t('action.reset')}</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.slice(0, visible).map(p => (
                  <div key={p.id} className="[&>div]:!w-full [&>div]:!min-w-0"><ProductCard p={p} /></div>
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-6 text-center">
                  <button onClick={() => setVisible(v => v + PAGE_SIZE)} className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 h-11 rounded-full">
                    {t('action.viewAll')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
