# ROSA Beauty — Handoff / گزارش تحویل پروژه

> فروشگاه زیبایی لوکس، تمام‌تعاملی، چندزبانه (فا/en/ar)، React + TypeScript + Vite + Tailwind v4 + Supabase.

این مستند همهٔ آنچه برای **گرفتن کدها، اجرا روی سرور خودتان، و وصل‌کردن به Supabase/دشبورد ادمینِ موجود** نیاز دارید را یکجا گردآوری می‌کند.

---

## ۱) ساختار پروژه

```
rosa-beauty/
├── index.html                  ← عنوان، فونت‌های Vazirmatn + Cormorant، ریشهٔ React
├── public/
│   └── favicon.svg
├── .env.example                ← الگوی متغیرهای محیطی (برای .env.local کپی کن)
├── SUPABASE_SCHEMA.sql         ← DDL + RLS آمادهٔ paste در Supabase SQL Editor
├── README.md                   ← راهنمای کوتاه راه‌اندازی
├── HANDOFF.md                  ← همین فایل
├── package.json                ← React 19, Vite 7, Tailwind 4, @supabase/supabase-js, framer-motion, lucide-react, react-router-dom
└── src/
    ├── main.tsx                ← bootstrap React
    ├── App.tsx                 ← HashRouter + Providers + تمام صفحه‌ها
    ├── index.css               ← Tailwind v4 + تم بورگاندی + انیمیشن‌ها
    ├── data.ts                 ← کاتالوگ محصولات محلی (fallback) + دسته‌ها/برندها/مقالات
    ├── i18n.ts                 ← دیکشنری سه‌زبانه + Provider + persist (localStorage) + جهت‌دهی RTL/LTR روی <html>
    ├── store.ts                ← StoreProvider (products + cart + wishlist + auth + orders)
    │                             ← Supabase هست؟ به دیتابیس می‌زند. نیست؟ به localStorage.
    ├── lib/
    │   ├── supabase.ts         ← supabase client واحد؛ اگر env نبود null می‌شود
    │   ├── db.ts               ← همهٔ کوئری‌ها: fetchProducts، subscribeProducts (Realtime)،
    │   │                         authSignIn/Up/Out، createOrder، fetchMyOrders،
    │   │                         fetchWishlist/addWish/removeWish، subscribeNewsletter
    │   └── utils.ts            ← formatPrice, discounted, localizeDigits (۰۱۲.. ⇄ ٠١٢.. ⇄ 012..)
    ├── components/
    │   ├── TopBar.tsx          ← نوار بالا (تلفن، ارسال رایگان، پیگیری سفارش)
    │   ├── Header.tsx          ← لوگو + سرچ + ناوبری + سبد/علاقه/حساب + منوی موبایل
    │   ├── LangSwitcher.tsx    ← دراپ‌داون فا/en/ar
    │   ├── Hero.tsx            ← اسلایدر هیرو با auto-play و dot indicator
    │   ├── Services.tsx        ← ۴ کارت خدمات (ارسال، اصالت، مرجوعی، پشتیبانی)
    │   ├── CategoryStrip.tsx   ← کارت‌های دسته‌بندی (۴ دسته)
    │   ├── FlashDeals.tsx      ← پیشنهاد شگفت‌انگیز با تایمر معکوس زنده
    │   ├── ProductSection.tsx  ← اسلایدر افقی محصولات با navigation
    │   ├── ProductCard.tsx     ← کارت محصول: badge، تخفیف، wishlist، add-to-cart
    │   ├── BrandStory.tsx      ← بلاک داستان برند
    │   ├── BrandsMarquee.tsx   ← نوار برندها (marquee)
    │   ├── Articles.tsx        ← سه مقاله از مجله
    │   ├── Newsletter.tsx      ← فرم خبرنامه (وصل به Supabase)
    │   ├── Footer.tsx          ← فوتر با چهار ستون + شبکه‌های اجتماعی
    │   └── Toaster.tsx         ← نوتیفیکیشن‌های موفقیت/خطا
    └── pages/
        ├── Home.tsx            ← صفحهٔ اصلی (hero → services → categories → deals → best → story → brands → journal → newsletter)
        ├── Shop.tsx            ← فهرست کامل + فیلتر دسته/قیمت + مرتب‌سازی + Load More
        ├── ProductDetail.tsx   ← گالری تصاویر + qty stepper + add-to-cart + buy-now + related
        ├── Cart.tsx            ← سبد خرید کامل با subtotal/shipping/total + stock-guard
        ├── Checkout.tsx        ← فرم کامل با اعتبارسنجی + خلاصه سفارش + صفحهٔ موفقیت با کد پیگیری
        ├── Account.tsx         ← ورود/ثبت‌نام + پروفایل + تاریخچه سفارشات
        ├── Wishlist.tsx        ← علاقه‌مندی‌ها (گرید ProductCard)
        ├── Magazine.tsx        ← صفحهٔ مجله
        └── Contact.tsx         ← صفحهٔ تماس
```

---

## ۲) چک‌لیست تعاملات (همه کار می‌کنند)

### Header
- [x] لوگو → مسیر `/`
- [x] لینک‌های ناوبری اصلی (Home, Shop, Skincare, Makeup, Perfume, Haircare, Magazine, Contact)
- [x] جستجو → `/shop?q=…` (در عنوان فارسی/عربی/انگلیسی و برند جست‌وجو می‌کند)
- [x] دکمهٔ زبان (persist در localStorage، جهت‌دهی `<html lang/dir>`)
- [x] حساب → `/account` (ورود/ثبت‌نام)
- [x] سبد خرید → `/cart` (با badge تعدادی)
- [x] علاقه‌مندی‌ها → `/wishlist` (با badge تعدادی)
- [x] منوی موبایل drawer

### محصولات
- [x] باز شدن صفحهٔ محصول با کلیک روی عکس/عنوان
- [x] افزودن به سبد (با بررسی موجودی)
- [x] افزودن/حذف از علاقه‌مندی
- [x] گالری تصاویر (thumbnail-ها)
- [x] stepper تعداد (محدود به موجودی)
- [x] نمایش وضعیت موجودی + قیمت + تخفیف
- [x] محصولات مشابه در پایین صفحه

### فروشگاه (/shop)
- [x] فیلتر دسته‌بندی
- [x] فیلتر قیمت (range)
- [x] مرتب‌سازی: جدیدترین، ارزان/گران، پرامتیاز، بیشترین تخفیف
- [x] Load More (۱۲ تایی)
- [x] empty state برای جستجوی بی‌نتیجه
- [x] نمایش نتایج جستجو با عبارت

### سبد خرید
- [x] افزایش/کاهش تعداد (bound به موجودی)
- [x] حذف آیتم
- [x] محاسبه subtotal، shipping (ارسال رایگان ≥ ۵۰۰٬۰۰۰)، total
- [x] persist در localStorage
- [x] empty state با CTA

### Checkout
- [x] فیلدها: نام، تلفن، ایمیل، شهر، آدرس، کد پستی، توضیحات
- [x] اعتبارسنجی client-side (طول، الزامی)
- [x] خلاصه سفارش (آیتم‌ها + جمع‌ها)
- [x] guard: اگر Supabase فعال است و کاربر login نیست، توی صفحهٔ checkout هشدار می‌دهد
- [x] ثبت سفارش → `orders` + `order_items` در Supabase
- [x] صفحهٔ موفقیت با کد پیگیری `ROS-XXXXXX`

### حساب
- [x] ورود با ایمیل/رمز (Supabase Auth)
- [x] ثبت‌نام (handle_new_user trigger، رکورد profiles خودکار می‌سازد)
- [x] خروج (clear session + cart/wishlist باقی می‌ماند)
- [x] نمایش اطلاعات کاربر
- [x] تاریخچه سفارش (join روی order_items)

### دیگر
- [x] خبرنامه (insert در `newsletter_subscribers`)
- [x] تمام لینک‌های فوتر به مسیرهای واقعی
- [x] تمام لینک‌های CTA بنرها / هیرو → صفحه‌های واقعی
- [x] Toast برای افزودن به سبد و خطاها
- [x] loading spinner در جاهای async

---

## ۳) ترجمه‌ها (i18n)

کلیدها در `src/i18n.ts` قرار دارند. سه دیکشنری کامل:

```ts
dicts.fa   // فارسی (RTL)
dicts.en   // English (LTR)
dicts.ar   // العربية (RTL)
```

- فال‌بک خودکار: اگر کلید در زبان جاری نباشد، از انگلیسی برمی‌دارد.
- اعداد به ترتیب با `localizeDigits()` به ۰-۹ فارسی یا ٠-٩ عربی تبدیل می‌شوند.
- سوییچ زبان جهت `<html dir>` را عوض می‌کند و در `localStorage` ذخیره می‌شود.

**اضافه کردن کلید جدید:** در هر سه دیکشنری همان کلید را بگذارید. تمام.

---

## ۴) Supabase

### وصل‌کردن
۱. در داشبورد Supabase، در SQL Editor فایل `SUPABASE_SCHEMA.sql` را paste و اجرا کنید.
۲. در `.env.local`:
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
۳. در تنظیمات Vercel/host همان دو را در Environment Variables اضافه کنید.
۴. دشبورد ادمین شما همین جداول را می‌نویسد؛ به‌خاطر Realtime، storefront بلافاصله به‌روز می‌شود.

### جداول و RLS (خلاصه)
| جدول | چه کسی می‌تواند بخواند | چه کسی می‌تواند بنویسد |
|---|---|---|
| `products` | هرکسی اگر `active=true` | فقط service_role (داشبورد ادمین) |
| `profiles` | فقط owner | فقط owner |
| `orders` | فقط owner | فقط owner (insert) |
| `order_items` | فقط owner از طریق orders | فقط owner (insert) |
| `wishlists` | فقط owner | فقط owner |
| `newsletter_subscribers` | — | هرکسی insert |

### Realtime
در `src/store.ts` تابع `subscribeProducts(load)` به کانال `postgres_changes:public.products` گوش می‌دهد؛ هر تغییر قیمت/موجودی/فعال‌بودن → بلافاصله refetch.

---

## ۵) محدودیت‌ها (صادقانه)

1. **درگاه پرداخت** پیاده نشده. الآن «پرداخت در محل». برای Zarinpal/IDPay/NextPay:
   - در `src/pages/Checkout.tsx` قبل از `placeOrder` کاربر را به URL شروع پرداخت ارسال کنید.
   - در callback (صفحه‌ای مثل `/payment/callback`) `placeOrder` را صدا بزنید.
2. **ایمیل تراکنشی** پیاده نشده. راه حل پیشنهادی:
   - Supabase Edge Function + Resend/Postmark
   - trigger = `after insert on orders`
3. **فراموشی رمز / OTP** UI ندارد. Supabase Auth پشتیبانی می‌کند؛ کافی‌ست یک صفحهٔ `/forgot` اضافه کنید و `supabase.auth.resetPasswordForEmail` را صدا بزنید.
4. **موجودی به صورت اتمی کم نمی‌شود.** الآن سفارش را ثبت می‌کند اما `stock -= qty` نمی‌کند. برای جلوگیری از oversell یک Edge Function یا database trigger در `order_items insert` اضافه کنید.
5. **تصاویر محصولات** اگر از دشبورد ادمین upload نشده باشند، از Unsplash fallback استفاده می‌شود. توصیه: Storage bucket به نام `products` بسازید و URL عمومی را در ستون `images` ذخیره کنید (کامنت‌های schema).
6. **پنل ادمین** جزء این repo نیست؛ همان پنل موجود شما ادامه می‌دهد.
7. **پیش‌نمایش preview** این deploy بدون env vars است → روی localStorage کار می‌کند، نه روی DB شما.

---

## ۶) اجرا

### اجرای محلی
```bash
npm install
cp .env.example .env.local        # مقادیر Supabase را پر کنید
npm run dev                       # http://localhost:5173
```

### بیلد production
```bash
npm run build                     # خروجی در dist/
npm run preview                   # پیش‌نمایش بیلد
```

### Vercel / Netlify
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

> نکته: router از `HashRouter` استفاده می‌کند تا نیازی به rewrite rules نباشد. اگر ترجیح می‌دهید `BrowserRouter` باشد، در `src/App.tsx` عوض کنید و در Vercel یک `vercel.json` با rewrite `"/(.*)"` به `/index.html` اضافه کنید.

---

## ۷) نقشهٔ مسیرها

| مسیر | صفحه | توضیح |
|---|---|---|
| `/` | Home | صفحهٔ اصلی لوکس |
| `/shop` | Shop | همهٔ محصولات + فیلتر + سورت |
| `/shop/:cat` | Shop | دسته: skincare \| makeup \| perfume \| haircare |
| `/shop?q=…` | Shop | نتایج جستجو |
| `/product/:id` | ProductDetail | صفحهٔ محصول |
| `/cart` | Cart | سبد خرید |
| `/checkout` | Checkout | تکمیل سفارش |
| `/account` | Account | ورود/ثبت‌نام/تاریخچه |
| `/wishlist` | Wishlist | علاقه‌مندی‌ها |
| `/magazine` | Magazine | مجله |
| `/contact` | Contact | تماس |

---

## ۸) چک‌لیست نهایی قبل از production

- [ ] `.env.local` با مقادیر واقعی Supabase پر شده
- [ ] `SUPABASE_SCHEMA.sql` روی پروژه اجرا شده
- [ ] دشبورد ادمینِ موجود برای همین پروژهٔ Supabase کانفیگ است
- [ ] تصاویر محصولات در Storage `products` upload شده یا URL معتبر دارند
- [ ] در دشبورد Vercel هر دو env var اضافه شده
- [ ] `npm run build` بدون خطا
- [ ] تست کامل: browse → search → detail → add to cart → change qty → wishlist → change lang → register → login → checkout → verify in Supabase `orders` + `order_items`
- [ ] (اختیاری) درگاه پرداخت وصل شد
- [ ] (اختیاری) Edge Function برای کم‌کردن اتمی موجودی اضافه شد

---

به‌سلامت 🌹
