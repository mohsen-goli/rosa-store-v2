import { Instagram, Send, MessageCircle, Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { localizeDigits } from '../lib/utils'

export default function Footer() {
  const { t, lang } = useI18n()
  const linksCol = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.shop'), to: '/shop' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.magazine'), to: '/magazine' },
    { label: t('nav.contact'), to: '/contact' },
  ]
  const serviceCol = [
    { label: t('top.track'), to: '/account' },
    { label: t('top.faq'), to: '#' },
    { label: t('action.wishlist'), to: '/wishlist' },
    { label: t('action.cart'), to: '/cart' },
  ]
  return (
    <footer className="mt-14 bg-ink-900 text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white shadow-lg shadow-brand-500/30">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3c-3 3-5 5-5 8a5 5 0 1 0 10 0c0-3-2-5-5-8z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-extrabold text-white">{t('brand.name')}</div>
              <div className="text-[11px] opacity-60">{t('brand.tag')}</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-75 max-w-md">{t('footer.aboutDesc')}</p>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2 opacity-80"><Phone className="w-4 h-4 text-brand-400" /> <span dir="ltr">{localizeDigits('021-91003030', lang)}</span></div>
            <div className="flex items-center gap-2 opacity-80"><Mail className="w-4 h-4 text-brand-400" /> info@rosabeauty.ir</div>
            <div className="flex items-center gap-2 opacity-80"><MapPin className="w-4 h-4 text-brand-400" /> Tehran · Valiasr Ave · 303</div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm">{t('footer.links')}</h4>
          <ul className="space-y-2 text-sm">
            {linksCol.map(l => <li key={l.label}><Link to={l.to} className="opacity-70 hover:opacity-100 hover:text-brand-300 transition">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">{t('footer.service')}</h4>
          <ul className="space-y-2 text-sm">
            {serviceCol.map(l => <li key={l.label}><Link to={l.to} className="opacity-70 hover:opacity-100 hover:text-brand-300 transition">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">{t('footer.contact')}</h4>
          <p className="text-sm opacity-70 leading-relaxed">info@rosabeauty.ir</p>
          <div className="flex items-center gap-2 mt-4">
            {[Instagram, Send, MessageCircle].map((I, k) => (
              <a key={k} href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-500 grid place-items-center transition"><I className="w-4 h-4" /></a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="opacity-60">© {t('brand.name')} · {localizeDigits('2011 — 2026', lang)} · {t('footer.rights')}.</div>
          <div className="opacity-60">{t('footer.follow')}</div>
        </div>
      </div>
    </footer>
  )
}
