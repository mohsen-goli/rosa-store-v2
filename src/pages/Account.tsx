import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Package2, User as UserIcon, Loader2 } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { formatPrice, localizeDigits } from '../lib/utils'

export default function Account() {
  const { user, login, register, logout, orders, supabaseReady } = useStore()
  const { t, lang } = useI18n()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    setNotice(null)
    if (!form.email || !form.password) { setErr('missing_fields'); return }
    if (mode === 'register' && !form.name.trim()) { setErr('missing_fields'); return }
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email.trim(), form.password)
      } else {
        const needsEmailConfirmation = await register(form.email.trim(), form.password, form.name.trim())
        if (needsEmailConfirmation) {
          setNotice(lang === 'fa'
            ? 'حساب ساخته شد. برای فعال‌سازی، ایمیل تأیید Supabase را باز کن و روی لینک تأیید بزن؛ سپس با همین ایمیل و رمز وارد شو.'
            : 'Your account was created. Open the Supabase confirmation email, click its link, then sign in with the same email and password.')
          setMode('login')
          setForm({ name: '', email: form.email.trim(), password: '' })
          return
        }
      }
      setForm({ name: '', email: '', password: '' })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'error'
      setErr(msg)
    } finally { setLoading(false) }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white border border-ink-100 rounded-3xl p-8">
          <h1 className="text-2xl font-extrabold text-ink-900 mb-1" style={{fontFamily:'var(--font-serif)'}}>
            {mode === 'login' ? t('account.login') : t('account.register')}
          </h1>
          <p className="text-ink-500 text-sm mb-6">{t('account.needLogin')}</p>

          {!supabaseReady && (
            <div className="mb-4 text-[11px] bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 leading-relaxed">
              Supabase is not configured on this preview — login runs locally. Set <code>VITE_SUPABASE_URL</code> + <code>VITE_SUPABASE_ANON_KEY</code> to enable real accounts.
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            {mode === 'register' && (
              <input
                required value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder={t('account.name')}
                className="w-full bg-sand border border-ink-100 rounded-xl px-3 py-3 text-sm outline-none focus:border-brand-400"
              />
            )}
            <input
              required type="email" value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              placeholder={t('account.email')}
              className="w-full bg-sand border border-ink-100 rounded-xl px-3 py-3 text-sm outline-none focus:border-brand-400"
            />
            <input
              required type="password" value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              placeholder={t('account.password')}
              className="w-full bg-sand border border-ink-100 rounded-xl px-3 py-3 text-sm outline-none focus:border-brand-400"
            />
            {notice && <div className="text-xs leading-6 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">{notice}</div>}
            {err && <div className="text-xs text-brand-600 break-words">{err}</div>}
            <button disabled={loading} className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white font-bold h-12 rounded-full flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? t('account.loginCta') : t('account.regCta')}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-ink-500">
            <button onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setErr(null); setNotice(null) }} className="text-brand-500 hover:text-brand-700">
              {mode === 'login' ? t('account.register') : t('account.login')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-12">
      <div className="bg-white border border-ink-100 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white"><UserIcon className="w-6 h-6" /></div>
            <div>
              <div className="text-xs text-ink-500">{t('account.welcome')}</div>
              <div className="font-extrabold text-lg text-ink-900">{user.name}</div>
              <div className="text-xs text-ink-500">{user.email}</div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 bg-sand hover:bg-ink-100 text-ink-700 text-sm font-semibold h-10 px-4 rounded-full">
            <LogOut className="w-4 h-4" /> {t('action.logout')}
          </button>
        </div>

        <h2 className="flex items-center gap-2 font-extrabold text-ink-900 mb-4"><Package2 className="w-4 h-4" /> {t('account.orders')}</h2>
        {orders.length === 0 ? (
          <div className="bg-sand rounded-2xl p-8 text-center text-ink-500 text-sm">
            {t('account.noOrders')} — <Link to="/shop" className="text-brand-500">{t('cart.emptyCta')}</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o.id} className="border border-ink-100 rounded-2xl p-4 flex flex-wrap items-center gap-4">
                <div>
                  <div className="text-xs text-ink-500">#</div>
                  <div className="font-bold" dir="ltr">{o.id}</div>
                </div>
                <div className="text-xs text-ink-500">{localizeDigits(new Date(o.createdAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-SA' : 'en-GB'), lang)}</div>
                <div className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{o.status}</div>
                <div className="ms-auto font-extrabold text-brand-600">{formatPrice(o.total, lang)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
