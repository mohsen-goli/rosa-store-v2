// Lightweight i18n: fa / en / ar with RTL direction & persistence
import { createContext, useContext, useEffect, useState, type ReactNode, createElement } from 'react'

export type Lang = 'fa' | 'en' | 'ar'
export const LANGS: { code: Lang, label: string, dir: 'rtl' | 'ltr', flag: string }[] = [
  { code: 'fa', label: 'فارسی',   dir: 'rtl', flag: '🇮🇷' },
  { code: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', dir: 'rtl', flag: '🇸🇦' },
]

type Dict = Record<string, string>
const dicts: Record<Lang, Dict> = {
  fa: {
    'brand.name': 'رُزا بیوتی',
    'brand.tag':  'فروشگاه لوکس زیبایی',

    'nav.home': 'خانه',
    'nav.shop': 'فروشگاه',
    'nav.skincare': 'مراقبت پوست',
    'nav.makeup':   'آرایش صورت',
    'nav.perfume':  'عطر و ادکلن',
    'nav.haircare': 'مراقبت مو',
    'nav.magazine': 'مجله زیبایی',
    'nav.contact':  'تماس',

    'top.freeShip': 'ارسال رایگان سفارش بالای ۵۰۰ هزار تومان',
    'top.country':  'ارسال به سراسر کشور',
    'top.track':    'پیگیری سفارش',
    'top.faq':      'سوالات متداول',

    'action.search':        'جستجو',
    'action.searchPlace':   'نام محصول، برند یا دسته‌بندی را جستجو کنید…',
    'action.login':         'ورود / ثبت‌نام',
    'action.logout':        'خروج',
    'action.register':      'ثبت‌نام',
    'action.cart':          'سبد خرید',
    'action.wishlist':      'علاقه‌مندی‌ها',
    'action.addCart':       'افزودن به سبد',
    'action.addedCart':     'افزوده شد',
    'action.viewAll':       'مشاهده همه',
    'action.checkout':      'ادامه و پرداخت',
    'action.placeOrder':    'ثبت سفارش',
    'action.continueShop':  'ادامه خرید',
    'action.buy':           'خرید محصول',
    'action.viewProduct':   'مشاهده محصول',
    'action.remove':        'حذف',
    'action.toman':         'تومان',
    'action.off':           'تخفیف',
    'action.filter':        'فیلترها',
    'action.sort':          'مرتب‌سازی',
    'action.apply':         'اعمال',
    'action.reset':         'حذف فیلترها',

    'sort.newest':      'جدیدترین',
    'sort.cheapest':    'ارزان‌ترین',
    'sort.expensive':   'گران‌ترین',
    'sort.mostRated':   'پرامتیازترین',
    'sort.mostOff':     'بیشترین تخفیف',

    'home.hero.tag':   'کالکشن انحصاری ۱۴۰۵',
    'home.hero.title': 'ظرافتِ طبیعی،\nزیباییِ جاودانه',
    'home.hero.desc':  'برندهای اصیل جهانی، مشاوره تخصصی و ارسال سریع — تجربه‌ای آرام از خریدِ زیبایی.',
    'home.hero.cta':   'مشاهده کالکشن',

    'home.categoriesTitle': 'دسته‌بندی‌های منتخب',
    'home.categoriesSub':   'هرچه برای زیبایی روزانه نیاز دارید',

    'home.dealsTitle': 'پیشنهاد شگفت‌انگیز',
    'home.dealsSub':   'تخفیف‌های محدود روی برترین محصولات',

    'home.bestTitle':  'پرفروش‌ترین محصولات',
    'home.bestSub':    'انتخاب هزاران مشتری رُزا',

    'home.storyTag':   'داستان رُزا',
    'home.storyTitle': 'زیبایی‌ای که از دل طبیعت می‌آید',
    'home.storyDesc':  'از سال ۱۳۹۰، رُزا بیوتی با گزینش وسواس‌گونه برندهای اصیل و تضمین اصالت، تجربه‌ای ممتاز از خرید محصولات زیبایی را فراهم کرده است. هر محصول، داستانی از دقت و هنر است.',
    'home.storyCta':   'بیشتر درباره ما',

    'home.brandsTitle': 'برندهای همکار',
    'home.magTitle':    'از مجله رُزا',
    'home.magSub':      'راهنماها و مقالات تخصصی زیبایی',

    'home.newsTitle': 'به خبرنامه رُزا بپیوندید',
    'home.newsSub':   'تخفیف‌های انحصاری، محصولات جدید و مقالات هفتگی',
    'home.newsPlace': 'ایمیل شما',
    'home.newsCta':   'عضویت',
    'home.newsOk':    'با موفقیت عضو شدید',

    'product.rating':     'امتیاز',
    'product.inStock':    'موجود در انبار',
    'product.outStock':   'ناموجود',
    'product.brand':      'برند',
    'product.category':   'دسته‌بندی',
    'product.qty':        'تعداد',
    'product.desc':       'توضیحات محصول',
    'product.descBody':   'این محصول اصل و با تضمین اصالت از نمایندگی رسمی تهیه شده و بسته‌بندی بهداشتی آن توسط رُزا بیوتی تضمین می‌شود.',
    'product.features':   'ویژگی‌ها',
    'product.f1':         'ترکیب بدون پارابن و الکل',
    'product.f2':         'تست شده توسط متخصص پوست',
    'product.f3':         'مناسب انواع پوست',
    'product.f4':         'ارسال ۲۴ ساعته و پرداخت در محل',

    'cart.title':       'سبد خرید شما',
    'cart.empty':       'سبد خرید شما خالی است',
    'cart.emptyCta':    'بازگشت به فروشگاه',
    'cart.item':        'محصول',
    'cart.subtotal':    'جمع کل',
    'cart.shipping':    'هزینه ارسال',
    'cart.free':        'رایگان',
    'cart.total':       'مبلغ قابل پرداخت',

    'checkout.title':   'تکمیل سفارش',
    'checkout.name':    'نام و نام خانوادگی',
    'checkout.phone':   'شماره موبایل',
    'checkout.email':   'ایمیل (اختیاری)',
    'checkout.city':    'شهر',
    'checkout.address': 'نشانی کامل پستی',
    'checkout.postal':  'کد پستی',
    'checkout.note':    'توضیحات سفارش (اختیاری)',
    'checkout.pay':     'پرداخت در محل',
    'checkout.summary': 'خلاصه سفارش',
    'checkout.success': 'سفارش شما با موفقیت ثبت شد!',
    'checkout.successDesc': 'کد پیگیری سفارش شما:',
    'checkout.backHome': 'بازگشت به خانه',

    'account.title':     'حساب کاربری من',
    'account.login':     'ورود به حساب',
    'account.register':  'ایجاد حساب جدید',
    'account.email':     'ایمیل یا شماره موبایل',
    'account.password':  'رمز عبور',
    'account.name':      'نام و نام خانوادگی',
    'account.loginCta':  'ورود',
    'account.regCta':    'ایجاد حساب',
    'account.welcome':   'خوش آمدید',
    'account.orders':    'سفارش‌های من',
    'account.noOrders':  'شما تاکنون سفارشی ثبت نکرده‌اید',
    'account.profile':   'اطلاعات کاربری',
    'account.needLogin': 'ابتدا وارد حساب خود شوید',

    'shop.title':   'فروشگاه محصولات',
    'shop.sub':     'همه محصولات زیبایی در یک جا',
    'shop.empty':   'محصولی با این شرایط پیدا نشد',
    'shop.found':   'محصول یافت شد',
    'shop.search':  'نتایج جستجو برای',
    'shop.cats':    'دسته‌بندی‌ها',
    'shop.price':   'محدوده قیمت',

    'service.ship':  'ارسال سریع',
    'service.auth':  'تضمین اصالت',
    'service.ret':   'مرجوعی ۷ روزه',
    'service.sup':   'پشتیبانی تخصصی',

    'footer.about':  'درباره رُزا',
    'footer.aboutDesc': 'فروشگاه اینترنتی رُزا بیوتی، مرجع تخصصی محصولات آرایشی و بهداشتی اصل با تضمین اصالت و ارسال سریع به سراسر ایران.',
    'footer.links':  'دسترسی سریع',
    'footer.service':'خدمات مشتریان',
    'footer.contact':'ارتباط با ما',
    'footer.rights': 'تمامی حقوق محفوظ است',
    'footer.follow': 'ما را دنبال کنید:',
  },

  en: {
    'brand.name': 'Rosa Beauty',
    'brand.tag':  'Luxury Beauty Store',

    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.skincare': 'Skincare',
    'nav.makeup':   'Makeup',
    'nav.perfume':  'Fragrance',
    'nav.haircare': 'Haircare',
    'nav.magazine': 'Journal',
    'nav.contact':  'Contact',

    'top.freeShip': 'Free shipping on orders over $50',
    'top.country':  'We ship nationwide',
    'top.track':    'Track order',
    'top.faq':      'FAQ',

    'action.search':        'Search',
    'action.searchPlace':   'Search by product, brand or category…',
    'action.login':         'Sign in / Join',
    'action.logout':        'Sign out',
    'action.register':      'Register',
    'action.cart':          'Cart',
    'action.wishlist':      'Wishlist',
    'action.addCart':       'Add to Cart',
    'action.addedCart':     'Added',
    'action.viewAll':       'View all',
    'action.checkout':      'Proceed to Checkout',
    'action.placeOrder':    'Place order',
    'action.continueShop':  'Continue shopping',
    'action.buy':           'Buy now',
    'action.viewProduct':   'View product',
    'action.remove':        'Remove',
    'action.toman':         'IRR',
    'action.off':           'OFF',
    'action.filter':        'Filters',
    'action.sort':          'Sort',
    'action.apply':         'Apply',
    'action.reset':         'Reset',

    'sort.newest':    'Newest',
    'sort.cheapest':  'Price: low to high',
    'sort.expensive': 'Price: high to low',
    'sort.mostRated': 'Top rated',
    'sort.mostOff':   'Biggest discount',

    'home.hero.tag':   'Exclusive Collection 2026',
    'home.hero.title': 'Natural elegance,\ntimeless beauty',
    'home.hero.desc':  'Authentic global brands, expert advice and fast delivery — a calm, premium beauty-shopping experience.',
    'home.hero.cta':   'Explore collection',

    'home.categoriesTitle': 'Curated categories',
    'home.categoriesSub':   'Everything you need for your daily beauty ritual',

    'home.dealsTitle': 'Flash deals',
    'home.dealsSub':   'Limited-time offers on top products',

    'home.bestTitle':  'Bestsellers',
    'home.bestSub':    'Chosen by thousands of Rosa customers',

    'home.storyTag':   'The Rosa story',
    'home.storyTitle': 'Beauty, born from nature',
    'home.storyDesc':  'Since 2011, Rosa Beauty has handpicked authentic global brands and guaranteed their origin, crafting a premium experience for every beauty lover. Every product tells a story of craft and care.',
    'home.storyCta':   'About Rosa',

    'home.brandsTitle': 'Trusted brands',
    'home.magTitle':    'From the Rosa Journal',
    'home.magSub':      'Guides and expert articles on beauty',

    'home.newsTitle': 'Join the Rosa newsletter',
    'home.newsSub':   'Exclusive offers, new arrivals and weekly articles',
    'home.newsPlace': 'Your email',
    'home.newsCta':   'Subscribe',
    'home.newsOk':    'You are subscribed — thank you!',

    'product.rating':   'Rating',
    'product.inStock':  'In stock',
    'product.outStock': 'Out of stock',
    'product.brand':    'Brand',
    'product.category': 'Category',
    'product.qty':      'Quantity',
    'product.desc':     'Product description',
    'product.descBody': 'Authentic product, sourced directly from the official distributor and hygienically packaged by Rosa Beauty.',
    'product.features': 'Highlights',
    'product.f1':       'Paraben & alcohol free',
    'product.f2':       'Dermatologist tested',
    'product.f3':       'Suitable for all skin types',
    'product.f4':       '24-hour delivery & cash on delivery',

    'cart.title':    'Your cart',
    'cart.empty':    'Your cart is empty',
    'cart.emptyCta': 'Back to shop',
    'cart.item':     'Product',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free':     'Free',
    'cart.total':    'Total',

    'checkout.title':   'Checkout',
    'checkout.name':    'Full name',
    'checkout.phone':   'Phone number',
    'checkout.email':   'Email (optional)',
    'checkout.city':    'City',
    'checkout.address': 'Full shipping address',
    'checkout.postal':  'Postal code',
    'checkout.note':    'Order notes (optional)',
    'checkout.pay':     'Cash on delivery',
    'checkout.summary': 'Order summary',
    'checkout.success': 'Your order has been placed!',
    'checkout.successDesc': 'Your order tracking code:',
    'checkout.backHome': 'Back to home',

    'account.title':    'My account',
    'account.login':    'Sign in',
    'account.register': 'Create account',
    'account.email':    'Email or phone',
    'account.password': 'Password',
    'account.name':     'Full name',
    'account.loginCta': 'Sign in',
    'account.regCta':   'Create account',
    'account.welcome':  'Welcome',
    'account.orders':   'My orders',
    'account.noOrders': 'You have no orders yet',
    'account.profile':  'Profile',
    'account.needLogin':'Please sign in first',

    'shop.title':   'Shop all products',
    'shop.sub':     'Every beauty product, in one place',
    'shop.empty':   'No products match your filters',
    'shop.found':   'products found',
    'shop.search':  'Search results for',
    'shop.cats':    'Categories',
    'shop.price':   'Price range',

    'service.ship': 'Fast delivery',
    'service.auth': 'Authenticity guaranteed',
    'service.ret':  '7-day returns',
    'service.sup':  'Expert support',

    'footer.about':  'About Rosa',
    'footer.aboutDesc': 'Rosa Beauty is the trusted destination for authentic cosmetics and skincare, with guaranteed origin and nationwide delivery.',
    'footer.links':  'Quick links',
    'footer.service':'Customer care',
    'footer.contact':'Contact us',
    'footer.rights': 'All rights reserved',
    'footer.follow': 'Follow us:',
  },

  ar: {
    'brand.name': 'روزا بيوتي',
    'brand.tag':  'متجر الجمال الفاخر',

    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.skincare': 'العناية بالبشرة',
    'nav.makeup':   'المكياج',
    'nav.perfume':  'العطور',
    'nav.haircare': 'العناية بالشعر',
    'nav.magazine': 'مجلة روزا',
    'nav.contact':  'تواصل معنا',

    'top.freeShip': 'شحن مجاني للطلبات فوق ٥٠٠ ألف',
    'top.country':  'شحن إلى جميع المدن',
    'top.track':    'تتبع الطلب',
    'top.faq':      'الأسئلة الشائعة',

    'action.search':        'بحث',
    'action.searchPlace':   'ابحث عن منتج، علامة تجارية أو فئة…',
    'action.login':         'تسجيل الدخول',
    'action.logout':        'تسجيل الخروج',
    'action.register':      'إنشاء حساب',
    'action.cart':          'السلة',
    'action.wishlist':      'المفضلة',
    'action.addCart':       'أضف إلى السلة',
    'action.addedCart':     'تمت الإضافة',
    'action.viewAll':       'عرض الكل',
    'action.checkout':      'إتمام الشراء',
    'action.placeOrder':    'تأكيد الطلب',
    'action.continueShop':  'متابعة التسوق',
    'action.buy':           'اشترِ الآن',
    'action.viewProduct':   'عرض المنتج',
    'action.remove':        'حذف',
    'action.toman':         'ريال',
    'action.off':           'خصم',
    'action.filter':        'التصفية',
    'action.sort':          'الترتيب',
    'action.apply':         'تطبيق',
    'action.reset':         'إعادة ضبط',

    'sort.newest':    'الأحدث',
    'sort.cheapest':  'السعر: من الأقل',
    'sort.expensive': 'السعر: من الأعلى',
    'sort.mostRated': 'الأعلى تقييماً',
    'sort.mostOff':   'الأكبر خصماً',

    'home.hero.tag':   'المجموعة الحصرية ٢٠٢٦',
    'home.hero.title': 'أناقة طبيعية،\nجمال لا يفنى',
    'home.hero.desc':  'علامات عالمية أصلية، استشارات متخصصة وتوصيل سريع — تجربة هادئة وفاخرة للتسوق.',
    'home.hero.cta':   'استكشف المجموعة',

    'home.categoriesTitle': 'فئات مختارة',
    'home.categoriesSub':   'كل ما تحتاجينه لروتين الجمال اليومي',

    'home.dealsTitle': 'عروض سريعة',
    'home.dealsSub':   'عروض لفترة محدودة على أفضل المنتجات',

    'home.bestTitle':  'الأكثر مبيعاً',
    'home.bestSub':    'اختيار آلاف العملاء من روزا',

    'home.storyTag':   'قصة روزا',
    'home.storyTitle': 'جمال من قلب الطبيعة',
    'home.storyDesc':  'منذ عام ٢٠١١، تختار روزا بيوتي بعناية علامات عالمية موثوقة مع ضمان المصدر لتقدم تجربة فاخرة لكل من يعشق الجمال.',
    'home.storyCta':   'عن روزا',

    'home.brandsTitle': 'علاماتنا الشريكة',
    'home.magTitle':    'من مجلة روزا',
    'home.magSub':      'أدلة ومقالات متخصصة في الجمال',

    'home.newsTitle': 'انضمي إلى نشرة روزا',
    'home.newsSub':   'عروض حصرية، إصدارات جديدة ومقالات أسبوعية',
    'home.newsPlace': 'بريدك الإلكتروني',
    'home.newsCta':   'اشترك',
    'home.newsOk':    'تم اشتراكك بنجاح، شكراً!',

    'product.rating':   'التقييم',
    'product.inStock':  'متوفر',
    'product.outStock': 'غير متوفر',
    'product.brand':    'العلامة',
    'product.category': 'الفئة',
    'product.qty':      'الكمية',
    'product.desc':     'وصف المنتج',
    'product.descBody': 'منتج أصلي بضمان المصدر من الوكيل الرسمي، معبأ بعناية من قبل روزا بيوتي.',
    'product.features': 'المزايا',
    'product.f1':       'خالٍ من البارابين والكحول',
    'product.f2':       'مختبر من قبل أطباء الجلد',
    'product.f3':       'مناسب لجميع أنواع البشرة',
    'product.f4':       'توصيل خلال ٢٤ ساعة والدفع عند الاستلام',

    'cart.title':    'سلة التسوق',
    'cart.empty':    'سلتك فارغة',
    'cart.emptyCta': 'العودة إلى المتجر',
    'cart.item':     'المنتج',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.shipping': 'الشحن',
    'cart.free':     'مجاني',
    'cart.total':    'الإجمالي',

    'checkout.title':   'إتمام الطلب',
    'checkout.name':    'الاسم الكامل',
    'checkout.phone':   'رقم الجوال',
    'checkout.email':   'البريد (اختياري)',
    'checkout.city':    'المدينة',
    'checkout.address': 'عنوان الشحن',
    'checkout.postal':  'الرمز البريدي',
    'checkout.note':    'ملاحظات (اختياري)',
    'checkout.pay':     'الدفع عند الاستلام',
    'checkout.summary': 'ملخص الطلب',
    'checkout.success': 'تم تقديم طلبك بنجاح!',
    'checkout.successDesc': 'رقم تتبع الطلب:',
    'checkout.backHome': 'العودة للرئيسية',

    'account.title':    'حسابي',
    'account.login':    'تسجيل الدخول',
    'account.register': 'إنشاء حساب',
    'account.email':    'البريد أو الجوال',
    'account.password': 'كلمة المرور',
    'account.name':     'الاسم الكامل',
    'account.loginCta': 'دخول',
    'account.regCta':   'إنشاء حساب',
    'account.welcome':  'مرحباً',
    'account.orders':   'طلباتي',
    'account.noOrders': 'لا توجد طلبات بعد',
    'account.profile':  'الملف الشخصي',
    'account.needLogin':'يرجى تسجيل الدخول أولاً',

    'shop.title':   'جميع المنتجات',
    'shop.sub':     'كل منتجات الجمال في مكان واحد',
    'shop.empty':   'لا توجد منتجات مطابقة',
    'shop.found':   'منتجاً تم إيجاده',
    'shop.search':  'نتائج البحث عن',
    'shop.cats':    'الفئات',
    'shop.price':   'نطاق السعر',

    'service.ship': 'توصيل سريع',
    'service.auth': 'ضمان الأصالة',
    'service.ret':  'إرجاع خلال ٧ أيام',
    'service.sup':  'دعم متخصص',

    'footer.about':  'عن روزا',
    'footer.aboutDesc': 'روزا بيوتي وجهة موثوقة لمستحضرات التجميل والعناية الأصلية مع ضمان المصدر والتوصيل لجميع المدن.',
    'footer.links':  'روابط سريعة',
    'footer.service':'خدمة العملاء',
    'footer.contact':'تواصل معنا',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.follow': 'تابعنا:',
  },
}

type I18nCtx = {
  lang: Lang
  dir: 'rtl' | 'ltr'
  setLang: (l: Lang) => void
  t: (key: string) => string
}
const Ctx = createContext<I18nCtx>({ lang: 'fa', dir: 'rtl', setLang: () => {}, t: k => k })

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('rosa:lang') as Lang | null
    return saved && ['fa','en','ar'].includes(saved) ? saved : 'fa'
  })
  const dir = LANGS.find(l => l.code === lang)!.dir

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    localStorage.setItem('rosa:lang', lang)
  }, [lang, dir])

  const setLang = (l: Lang) => setLangState(l)
  const t = (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key

  return createElement(Ctx.Provider, { value: { lang, dir, setLang, t } }, children)
}

export function useI18n() { return useContext(Ctx) }
