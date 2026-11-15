import { Phone, MapPin, Truck } from 'lucide-react'
import { useI18n } from '../i18n'
import { localizeDigits } from '../lib/utils'

export default function TopBar() {
  const { t, lang } = useI18n()
  return (
    <div className="bg-ink-900 text-white text-[12px]">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
        <div className="flex items-center gap-4 text-ink-100">
          <span className="flex items-center gap-1 opacity-90"><Truck className="w-3.5 h-3.5 text-brand-300" /> {t('top.freeShip')}</span>
          <span className="hidden md:flex items-center gap-1 opacity-70"><MapPin className="w-3.5 h-3.5" /> {t('top.country')}</span>
        </div>
        <div className="flex items-center gap-4 opacity-90">
          <a href="#/account" className="hover:text-brand-300">{t('top.track')}</a>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-brand-300">{t('top.faq')}</a>
          <span className="opacity-30">|</span>
          <a href="tel:02191003030" className="flex items-center gap-1 hover:text-brand-300" dir="ltr"><Phone className="w-3.5 h-3.5" /> {localizeDigits('021-91003030', lang)}</a>
        </div>
      </div>
    </div>
  )
}
