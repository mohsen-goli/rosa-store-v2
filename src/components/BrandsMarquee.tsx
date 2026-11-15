import { brands } from '../data'
import { useI18n } from '../i18n'

export default function BrandsMarquee() {
  const { t } = useI18n()
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="bg-white rounded-3xl border border-ink-100 p-6">
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-ink-900" style={{fontFamily:'var(--font-serif)'}}>{t('home.brandsTitle')}</h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-3 marquee-track whitespace-nowrap" dir="ltr">
            {[...brands, ...brands].map((b, i) => (
              <div key={i} className="shrink-0 px-6 h-14 rounded-2xl bg-sand border border-ink-100 grid place-items-center text-ink-700 font-bold text-sm hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition">
                {b}
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 end-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 start-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
