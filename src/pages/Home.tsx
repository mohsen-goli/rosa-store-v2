import Hero from '../components/Hero'
import Services from '../components/Services'
import CategoryStrip from '../components/CategoryStrip'
import CatalogProductSection from '../components/CatalogProductSection'
import Ban from '../components/Ban'
import BrandStory from '../components/BrandStory'
import BrandsMarquee from '../components/BrandsMarquee'
import Articles from '../components/Articles'
import Newsletter from '../components/Newsletter'
import SiteFeedback from '../components/SiteFeedback'

import { useI18n } from '../i18n'
import { useCatalog } from '../CatalogContext'

export default function Home() {
  const { t, lang } = useI18n()
  const { products, market, loading, error } = useCatalog()

  const activeProducts = products.filter(product => product.isActive)

  const deals = activeProducts
    .filter(product =>
      product.variants.some(variant =>
        variant.discountPercent >= 20 &&
        variant.prices.some(price => price.market === market)
      )
    )
    .sort((a, b) => {
      const aDiscount = Math.max(
        ...a.variants.map(variant => variant.discountPercent)
      )
      const bDiscount = Math.max(
        ...b.variants.map(variant => variant.discountPercent)
      )

      return bDiscount - aDiscount
    })
    .slice(0, 8)

  const best = [...activeProducts]
    .filter(product =>
      product.variants.some(variant =>
        variant.prices.some(price => price.market === market)
      )
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)

  const dealsTitle = {
    fa: 'پیشنهادهای ویژه',
    en: 'Special Offers',
    ar: 'عروض خاصة',
  }[lang]

  const dealsSubtitle = {
    fa: 'فرصت‌های ویژه برای انتخاب محصولات محبوب',
    en: 'Special offers on selected products',
    ar: 'عروض مميزة على منتجات مختارة',
  }[lang]

  return (
    <>
      <Hero />
      <Services />
      <CategoryStrip />

      {loading && products.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-ink-500 text-sm">
          {lang === 'fa'
            ? 'در حال دریافت محصولات...'
            : lang === 'ar'
              ? 'جارٍ تحميل المنتجات...'
              : 'Loading products...'}
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-red-500 text-sm">
          {lang === 'fa'
            ? 'دریافت محصولات با مشکل مواجه شد.'
            : lang === 'ar'
              ? 'حدث خطأ أثناء تحميل المنتجات.'
              : 'There was a problem loading products.'}
        </div>
      ) : (
        <>
          {deals.length > 0 && (
            <CatalogProductSection
              title={dealsTitle}
              subtitle={dealsSubtitle}
              products={deals}
            />
          )}

          <Ban />

          {best.length > 0 && (
            <CatalogProductSection
              title={t('home.bestTitle')}
              subtitle={t('home.bestSub')}
              products={best}
            />
          )}

          {best.length === 0 && (
            <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-ink-500 text-sm">
              {lang === 'fa'
                ? 'هنوز محصولی برای نمایش وجود ندارد.'
                : lang === 'ar'
                  ? 'لا توجد منتجات للعرض حالياً.'
                  : 'No products to display yet.'}
            </div>
          )}
        </>
      )}

      <BrandStory />
      <BrandsMarquee />
      <Articles />
      <Newsletter />
      <SiteFeedback />
    </>
  )
}
