import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Heart, Leaf, Sparkles } from 'lucide-react'
import { useI18n } from '../i18n'

export default function About() {
  const { t, lang, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const values = [
    { icon: Sparkles, title: t('about.value1Title'), body: t('about.value1Desc') },
    { icon: Heart, title: t('about.value2Title'), body: t('about.value2Desc') },
    { icon: Leaf, title: t('about.value3Title'), body: t('about.value3Desc') },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 pt-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-ink-900 text-white min-h-[420px] md:min-h-[500px]">
        <img
          src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1800&q=85"
          alt="ROSA beauty and skincare"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/65 to-ink-900/15" />
        <div className="relative z-10 flex min-h-[420px] md:min-h-[500px] max-w-2xl flex-col justify-center p-7 md:p-14">
          <span className="mb-4 text-xs font-bold tracking-[0.25em] text-rose-200">{t('about.eyebrow')}</span>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('about.heroTitle')}
          </h1>
          <p className="max-w-xl text-sm leading-8 text-white/80 md:text-base">{t('about.heroDesc')}</p>
        </div>
      </section>

      <section className="grid items-center gap-8 py-14 md:grid-cols-2 md:gap-14 md:py-20">
        <div className="overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=85"
            alt="A considered beauty ritual"
            loading="lazy"
            className="h-[320px] w-full object-cover md:h-[460px]"
          />
        </div>
        <div className="max-w-xl">
          <span className="mb-3 block text-xs font-bold tracking-widest text-brand-500">{t('about.storyLabel')}</span>
          <h2 className="mb-5 text-3xl font-extrabold leading-tight text-ink-900 md:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('about.storyTitle')}
          </h2>
          <p className="text-sm leading-8 text-ink-600 md:text-base">{t('about.storyP1')}</p>
          <p className="mt-4 text-sm leading-8 text-ink-600 md:text-base">{t('about.storyP2')}</p>
          <p className="mt-6 border-s-2 border-brand-400 ps-4 text-lg font-semibold leading-8 text-brand-700">{t('about.quote')}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-ink-100 bg-white px-5 py-10 md:px-10 md:py-14">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-3 block text-xs font-bold tracking-widest text-brand-500">{t('about.valuesLabel')}</span>
          <h2 className="text-2xl font-extrabold text-ink-900 md:text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>{t('about.valuesTitle')}</h2>
          <p className="mt-3 text-sm leading-7 text-ink-500">{t('about.valuesDesc')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl bg-sand/60 p-6 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-bold text-ink-900">{title}</h3>
              <p className="text-sm leading-7 text-ink-500">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl bg-brand-50 px-6 py-10 text-center md:flex-row md:px-12 md:text-start">
        <div>
          <h2 className="text-2xl font-extrabold text-ink-900">{t('about.ctaTitle')}</h2>
          <p className="mt-2 text-sm text-ink-600">{t('about.ctaDesc')}</p>
        </div>
        <Link to="/shop" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand-500 px-6 font-bold text-white transition hover:bg-brand-600">
          {t('about.ctaButton')} <Arrow className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
