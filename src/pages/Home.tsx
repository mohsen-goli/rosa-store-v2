import Hero from '../components/Hero'
import Services from '../components/Services'
import CategoryStrip from '../components/CategoryStrip'
import FlashDeals from '../components/FlashDeals'
import ProductSection from '../components/ProductSection'
import BrandStory from '../components/BrandStory'
import BrandsMarquee from '../components/BrandsMarquee'
import Articles from '../components/Articles'
import Newsletter from '../components/Newsletter'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Home() {
  const { t } = useI18n()
  const { products, loadingProducts } = useStore()
  const deals = products.filter(p => p.discount && p.discount >= 20).slice(0, 8)
  const best  = [...products].sort((a,b) => b.rating - a.rating).slice(0, 8)

  return (
    <>
      <Hero />
      <Services />
      <CategoryStrip />
      {loadingProducts && products.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-ink-500 text-sm">…</div>
      ) : (
        <>
          <FlashDeals products={deals} />
          <ProductSection
            title={t('home.bestTitle')}
            subtitle={t('home.bestSub')}
            products={best}
          />
        </>
      )}
      <BrandStory />
      <BrandsMarquee />
      <Articles />
      <Newsletter />
    </>
  )
}
