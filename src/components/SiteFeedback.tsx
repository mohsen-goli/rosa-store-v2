import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'
import { supabase, hasSupabase } from '../lib/supabase'
import { useI18n } from '../i18n'

export default function SiteFeedback() {
  const { lang } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'success' | 'error' | ''>('')

  const copy = {
    fa: { title: 'صدای شما برای ROSA', sub: 'پیشنهاد، انتقاد یا تجربه‌ات را مستقیم با تیم ما در میان بگذار.', name: 'نام شما', email: 'ایمیل شما', message: 'پیام شما', send: 'ارسال پیام', sending: 'در حال ارسال...', success: 'پیامت با موفقیت ثبت شد. ممنونیم!', error: 'ارسال پیام انجام نشد. لطفاً کمی بعد دوباره تلاش کن.' },
    en: { title: 'Your voice matters to ROSA', sub: 'Share your feedback, ideas, or experience with our team.', name: 'Your name', email: 'Your email', message: 'Your message', send: 'Send message', sending: 'Sending...', success: 'Your message was received. Thank you!', error: 'Could not send your message. Please try again later.' },
    ar: { title: 'رأيك يهم ROSA', sub: 'شاركنا اقتراحاتك أو ملاحظاتك أو تجربتك.', name: 'اسمك', email: 'بريدك الإلكتروني', message: 'رسالتك', send: 'إرسال الرسالة', sending: 'جارٍ الإرسال...', success: 'تم استلام رسالتك. شكراً لك!', error: 'تعذر إرسال رسالتك. يرجى المحاولة لاحقاً.' },
  }[lang]

  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus('')
    if (website) return
    if (!hasSupabase || !supabase) {
      setStatus('error')
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.from('site_feedback').insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        status: 'new',
      })
      if (error) {
        console.error('[rosa] site feedback failed:', error.message)
        setStatus('error')
        return
      }
    } catch (error) {
      console.error('[rosa] site feedback failed:', error)
      setStatus('error')
      return
    } finally {
      setSending(false)
    }
    setName('')
    setEmail('')
    setMessage('')
    setStatus('success')
  }

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12 mb-8">
      <div className="rounded-3xl bg-[#321d26] text-white p-6 md:p-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
        <div>
          <span className="text-xs tracking-[0.22em] text-rose-200 uppercase">ROSA · COMMUNITY</span>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-3">{copy.title}</h2>
          <p className="text-sm text-white/70 leading-7 mt-3">{copy.sub}</p>
        </div>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <input value={name} onChange={e => setName(e.target.value)} required maxLength={100} placeholder={copy.name}
            className="min-w-0 rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-rose-200" />
          <input value={email} onChange={e => setEmail(e.target.value)} required type="email" maxLength={254} placeholder={copy.email}
            className="min-w-0 rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-rose-200" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} required minLength={5} maxLength={3000} rows={3} placeholder={copy.message}
            className="sm:col-span-2 rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-rose-200 resize-y" />
          <input value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="hidden" />
          {status && <p role={status === 'success' ? 'status' : 'alert'} className={`sm:col-span-2 text-sm ${status === 'success' ? 'text-emerald-300' : 'text-rose-200'}`}>{status === 'success' ? copy.success : copy.error}</p>}
          <button disabled={sending} className="sm:col-span-2 sm:justify-self-start inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#321d26] font-bold px-7 py-3 text-sm disabled:opacity-60">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? copy.sending : copy.send}
          </button>
        </form>
      </div>
    </section>
  )
}
