import { useI18n } from '../i18n'
import { Phone, Mail, MapPin } from 'lucide-react'
import { localizeDigits } from '../lib/utils'

export default function Contact() {
  const { t, lang } = useI18n()
  return (
    <div className="max-w-4xl mx-auto px-4 pt-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-ink-900 mb-2" style={{fontFamily:'var(--font-serif)'}}>{t('footer.contact')}</h1>
      <p className="text-ink-500 text-sm mb-8">{t('brand.tag')}</p>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <Phone className="w-5 h-5 text-brand-500 mb-3" />
          <div className="font-bold" dir="ltr">{localizeDigits('021-91003030', lang)}</div>
        </div>
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <Mail className="w-5 h-5 text-brand-500 mb-3" />
          <div className="font-bold">info@rosabeauty.ir</div>
        </div>
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <MapPin className="w-5 h-5 text-brand-500 mb-3" />
          <div className="font-bold">Tehran · Valiasr Ave 303</div>
        </div>
      </div>
    </div>
  )
}
