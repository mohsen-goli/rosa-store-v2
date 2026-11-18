import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Star } from 'lucide-react'
import { supabase, hasSupabase } from '../lib/supabase'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { localizeDigits } from '../lib/utils'

type Review = {
  id: string
  user_id: string
  display_name: string
  rating: number
  title: string
  body: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useStore()
  const { lang } = useI18n()
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const copy = {
    fa: {
      heading: 'نظرات مشتریان', empty: 'هنوز نظری برای این محصول ثبت نشده است.',
      write: 'نظر خودت را ثبت کن', login: 'برای ثبت نظر ابتدا وارد حساب کاربری شو.',
      loginCta: 'ورود / ثبت‌نام', rating: 'امتیاز شما', title: 'عنوان نظر',
      titlePlaceholder: 'تجربه‌ات از این محصول', body: 'متن نظر',
      bodyPlaceholder: 'تجربه‌ات را با جزئیات بنویس (حداقل ۱۰ کاراکتر)',
      submit: 'ارسال نظر برای بررسی', pending: 'نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود.',
      failed: 'ثبت نظر انجام نشد. دوباره تلاش کن.',
      loadFailed: 'بارگذاری نظرات ممکن نشد.', approved: 'تأیید شده', waiting: 'در انتظار بررسی',
      count: 'نظر', noBackend: 'برای ثبت و نمایش نظرات، اتصال Supabase لازم است.',
    },
    en: {
      heading: 'Customer reviews', empty: 'There are no reviews for this product yet.',
      write: 'Write a review', login: 'Please sign in to leave a review.',
      loginCta: 'Sign in / Register', rating: 'Your rating', title: 'Review title',
      titlePlaceholder: 'Your experience with this product', body: 'Your review',
      bodyPlaceholder: 'Share your experience (at least 10 characters)',
      submit: 'Submit for review', pending: 'Your review was submitted and will appear after moderation.',
      failed: 'Could not submit your review. Please try again.',
      loadFailed: 'Could not load reviews.', approved: 'Approved', waiting: 'Pending review',
      count: 'reviews', noBackend: 'Supabase connection is required for product reviews.',
    },
    ar: {
      heading: 'آراء العملاء', empty: 'لا توجد مراجعات لهذا المنتج بعد.',
      write: 'اكتب مراجعتك', login: 'يرجى تسجيل الدخول لإضافة مراجعة.',
      loginCta: 'تسجيل الدخول / إنشاء حساب', rating: 'تقييمك', title: 'عنوان المراجعة',
      titlePlaceholder: 'تجربتك مع هذا المنتج', body: 'مراجعتك',
      bodyPlaceholder: 'شارك تجربتك (10 أحرف على الأقل)',
      submit: 'إرسال للمراجعة', pending: 'تم إرسال مراجعتك وستظهر بعد المراجعة.',
      failed: 'تعذر إرسال المراجعة. حاول مرة أخرى.',
      loadFailed: 'تعذر تحميل المراجعات.', approved: 'تمت الموافقة', waiting: 'قيد المراجعة',
      count: 'مراجعة', noBackend: 'يلزم الاتصال بـ Supabase لتفعيل مراجعات المنتجات.',
    },
  }[lang]

  const loadReviews = useCallback(async () => {
    if (!hasSupabase || !supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('product_reviews')
      .select('id,user_id,display_name,rating,title,body,status,created_at')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (queryError) {
      console.error('[rosa] reviews load failed:', queryError.message)
      setError(copy.loadFailed)
    } else {
      setReviews((data ?? []) as Review[])
      setError('')
    }
    setLoading(false)
  }, [productId, lang])

  useEffect(() => { void loadReviews() }, [loadReviews])

  const visibleReviews = reviews.filter(review => review.status === 'approved' || review.user_id === user?.id)
  const approvedReviews = reviews.filter(review => review.status === 'approved')
  const average = approvedReviews.length
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
    : 0

  async function submitReview(event: FormEvent) {
    event.preventDefault()
    setError('')
    setNotice('')
    if (!hasSupabase || !supabase) {
      setError(copy.noBackend)
      return
    }
    if (!user?.id) return
    if (title.trim().length < 2 || body.trim().length < 10) {
      setError(copy.failed)
      return
    }
    setSubmitting(true)
    const { error: insertError } = await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: user.id,
      display_name: user.name.trim() || user.email.split('@')[0],
      rating,
      title: title.trim(),
      body: body.trim(),
      status: 'pending',
    })
    setSubmitting(false)
    if (insertError) {
      setError(copy.failed)
      return
    }
    setTitle('')
    setBody('')
    setRating(5)
    setNotice(copy.pending)
    await loadReviews()
  }

  const dateLocale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar' : 'en-US'

  return (
    <section className="mt-8 bg-white border border-ink-100 rounded-3xl p-6 md:p-8" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-ink-900">{copy.heading}</h2>
          <p className="text-xs text-ink-500 mt-1">
            {approvedReviews.length > 0
              ? <>{localizeDigits(average.toFixed(1), lang)} / 5 · {localizeDigits(approvedReviews.length, lang)} {copy.count}</>
              : copy.empty}
          </p>
        </div>
        {approvedReviews.length > 0 && (
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-5 h-5 fill-amber-400" />
            {localizeDigits(average.toFixed(1), lang)}
          </div>
        )}
      </div>

      {!hasSupabase && <p className="text-sm text-amber-700 bg-amber-50 rounded-xl p-3">{copy.noBackend}</p>}

      <div className="space-y-5">
        {loading ? (
          <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-brand-500" /></div>
        ) : visibleReviews.length === 0 ? (
          <div className="rounded-2xl bg-sand p-6 text-center text-sm text-ink-500">{copy.empty}</div>
        ) : visibleReviews.map(review => (
          <article key={review.id} className="rounded-2xl border border-ink-100 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-ink-900">{review.display_name}</div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`w-3.5 h-3.5 ${index < review.rating ? 'fill-amber-400' : 'text-ink-200'}`} />)}
              </div>
            </div>
            <h4 className="font-semibold text-sm mt-2">{review.title}</h4>
            <p className="text-sm text-ink-600 leading-7 mt-1 whitespace-pre-line">{review.body}</p>
            <div className="flex items-center justify-between mt-3 text-[11px] text-ink-400">
              <time dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString(dateLocale)}</time>
              {review.status === 'pending' && <span className="text-amber-600">{copy.waiting}</span>}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 border-t border-ink-100 pt-7">
        <h3 className="font-bold text-ink-800 mb-4">{copy.write}</h3>
        {!user?.id ? (
          <div className="rounded-2xl bg-sand p-4 text-sm text-ink-600">
            <p>{copy.login}</p>
            <Link to="/account" className="inline-flex mt-3 bg-brand-500 text-white rounded-full px-5 py-2 font-bold">{copy.loginCta}</Link>
          </div>
        ) : (
          <form onSubmit={submitReview} className="space-y-3">
            <div>
              <label className="block text-sm text-ink-600 mb-2">{copy.rating}</label>
              <div className="flex items-center gap-1" role="group" aria-label={copy.rating}>
                {[1,2,3,4,5].map(value => (
                  <button key={value} type="button" onClick={() => setRating(value)} aria-label={String(value)}
                    className={value <= rating ? 'text-amber-500' : 'text-ink-200'}>
                    <Star className={`w-7 h-7 ${value <= rating ? 'fill-amber-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <input value={title} onChange={e => setTitle(e.target.value)} required minLength={2} maxLength={120}
              placeholder={copy.titlePlaceholder} className="w-full bg-sand border border-ink-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400" />
            <textarea value={body} onChange={e => setBody(e.target.value)} required minLength={10} maxLength={2000} rows={4}
              placeholder={copy.bodyPlaceholder} className="w-full bg-sand border border-ink-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-y" />
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            {notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
            <button disabled={submitting} className="w-full md:w-auto min-w-52 h-11 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 px-6">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {copy.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
