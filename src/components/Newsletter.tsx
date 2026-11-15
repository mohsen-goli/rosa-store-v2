import { Mail, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import { useStore } from '../store'

export default function Newsletter() {
  const { t, lang } = useI18n()
  const { subscribeToNewsletter } = useStore()
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return
    setLoading(true)
    try {
      await subscribeToNewsletter(email, lang)
      setOk(true); setEmail('')
    } catch {
      // store already surfaces a toast with the error
    } finally { setLoading(false) }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-brand-800 to-brand-600 text-white p-8 md:p-12">
        <div className="absolute -end-10 -bottom-10 w-72 h-72 bg-brand-500/30 blur-3xl rounded-full" />
        <div className="absolute -start-10 -top-10 w-72 h-72 bg-fuchsia-500/20 blur-3xl rounded-full" />
        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs mb-4">
              <Mail className="w-3.5 h-3.5" /> {t('home.newsTitle')}
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2" style={{fontFamily:'var(--font-serif)'}}>{t('home.newsTitle')}</h3>
            <p className="text-white/70 text-sm max-w-md">{t('home.newsSub')}</p>
          </div>
          <form onSubmit={submit} className="flex gap-2 bg-white/10 border border-white/20 p-2 rounded-full">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" dir="ltr" placeholder={t('home.newsPlace')} className="flex-1 bg-transparent outline-none px-3 text-sm placeholder-white/50 text-white" />
            <button disabled={loading} className="bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white font-bold px-5 h-11 rounded-full text-sm transition flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {ok ? '✓' : t('home.newsCta')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
