import { Truck, ShieldCheck, Undo2, Headphones } from 'lucide-react'
import { useI18n } from '../i18n'

export default function Services() {
  const { t } = useI18n()
  const items = [
    { icon: Truck,       title: t('service.ship') },
    { icon: ShieldCheck, title: t('service.auth') },
    { icon: Undo2,       title: t('service.ret')  },
    { icon: Headphones,  title: t('service.sup')  },
  ]
  return (
    <section className="max-w-7xl mx-auto px-4 mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(({icon: Icon, title}) => (
        <div key={title} className="bg-white rounded-2xl border border-ink-100 p-4 flex items-center gap-3 hover:border-brand-200 transition">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-ink-900">{title}</div>
        </div>
      ))}
    </section>
  )
}
