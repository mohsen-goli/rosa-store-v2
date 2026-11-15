import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { formatPrice } from '../lib/utils'

export default function Checkout() {
  const { cart, cartSubtotal, placeOrder, getProduct, user, supabaseReady } = useStore()
  const { t, lang } = useI18n()
  const nav = useNavigate()
  const [done, setDone] = useState<null | { id: string }>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '',
    city: '', address: '', postal: '', note: '',
  })
  const [err, setErr] = useState<Record<string, boolean>>({})

  const shipping = cartSubtotal >= 500_000 ? 0 : 45_000
  const total = cartSubtotal + shipping

  if (cart.length === 0 && !done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">{t('cart.empty')}</p>
        <Link to="/shop" className="inline-block mt-4 text-brand-500">{t('cart.emptyCta')}</Link>
      </div>
    )
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitErr(null)
    const errors: Record<string, boolean> = {}
    if (!form.name.trim()) errors.name = true
    if (!form.phone.trim() || form.phone.trim().length < 7) errors.phone = true
    if (!form.city.trim()) errors.city = true
    if (!form.address.trim() || form.address.trim().length < 6) errors.address = true
    setErr(errors)
    if (Object.keys(errors).length) return

    if (supabaseReady && !user) {
      setSubmitErr(t('account.needLogin'))
      return
    }

    setSubmitting(true)
    try {
      const order = await placeOrder(form)
      setDone({ id: order.id })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'order_failed'
      setSubmitErr(msg)
    } finally { setSubmitting(false) }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full grid place-items-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2" style={{fontFamily:'var(--font-serif)'}}>{t('checkout.success')}</h1>
        <p className="text-ink-500 text-sm">{t('checkout.successDesc')}</p>
        <div className="mt-3 inline-block bg-sand px-4 py-2 rounded-xl font-bold" dir="ltr">{done.id}</div>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => nav('/')} className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 h-11 rounded-full">{t('checkout.backHome')}</button>
          <Link to="/account" className="bg-sand hover:bg-ink-100 font-bold px-6 h-11 rounded-full grid place-items-center">{t('account.orders')}</Link>
        </div>
      </div>
    )
  }

  const field = (name: keyof typeof form, label: string, type = 'text') => (
    <label className="block">
      <div className="text-xs font-bold text-ink-700 mb-1">{label}</div>
      <input
        type={type} value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className={`w-full bg-sand border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 ${err[name] ? 'border-brand-500' : 'border-ink-100'}`}
      />
    </label>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
      <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-6" style={{fontFamily:'var(--font-serif)'}}>{t('checkout.title')}</h1>

      {supabaseReady && !user && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-sm flex items-center justify-between gap-4">
          <span>{t('account.needLogin')}</span>
          <Link to="/account" className="bg-amber-800 text-white text-xs font-bold px-4 h-9 rounded-full grid place-items-center">{t('account.login')}</Link>
        </div>
      )}

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-5">
        <div className="bg-white border border-ink-100 rounded-2xl p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {field('name', t('checkout.name'))}
            {field('phone', t('checkout.phone'), 'tel')}
            {field('email', t('checkout.email'), 'email')}
            {field('city', t('checkout.city'))}
          </div>
          <label className="block">
            <div className="text-xs font-bold text-ink-700 mb-1">{t('checkout.address')}</div>
            <textarea rows={3} value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} className={`w-full bg-sand border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 ${err.address ? 'border-brand-500' : 'border-ink-100'}`} />
          </label>
          {field('postal', t('checkout.postal'))}
          <label className="block">
            <div className="text-xs font-bold text-ink-700 mb-1">{t('checkout.note')}</div>
            <textarea rows={2} value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))} className="w-full bg-sand border border-ink-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
          </label>
        </div>

        <aside className="bg-white border border-ink-100 rounded-2xl p-5 h-max">
          <h3 className="font-extrabold text-sm mb-4">{t('checkout.summary')}</h3>
          <div className="space-y-2 text-sm mb-4">
            {cart.map(i => {
              const p = getProduct(i.productId); if (!p) return null
              return (
                <div key={i.productId} className="flex justify-between gap-2">
                  <span className="text-ink-700 line-clamp-1">{p.title[lang]}</span>
                  <span className="text-ink-500 whitespace-nowrap">×{i.qty}</span>
                </div>
              )
            })}
          </div>
          <div className="space-y-2 border-t border-ink-100 pt-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-500">{t('cart.subtotal')}</span><span className="font-bold">{formatPrice(cartSubtotal, lang)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">{t('cart.shipping')}</span><span className="font-bold">{shipping === 0 ? t('cart.free') : formatPrice(shipping, lang)}</span></div>
            <div className="flex justify-between items-end border-t border-ink-100 pt-3">
              <span className="text-ink-500">{t('cart.total')}</span>
              <span className="font-extrabold text-lg text-brand-600">{formatPrice(total, lang)}</span>
            </div>
          </div>
          {submitErr && <div className="mt-3 text-xs text-brand-600">{submitErr}</div>}
          <button disabled={submitting} className="mt-5 w-full bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white font-bold h-12 rounded-full flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('action.placeOrder')}
          </button>
          <p className="mt-3 text-[11px] text-ink-500 text-center">{t('checkout.pay')}</p>
        </aside>
      </form>
    </div>
  )
}
