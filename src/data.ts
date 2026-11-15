// Product catalog. Each product carries titles in 3 languages so the
// storefront stays fully i18n-correct without a backend join.
import type { Lang } from './i18n'

export type Category = 'skincare' | 'makeup' | 'perfume' | 'haircare'

export type Product = {
  id: string
  title: Record<Lang, string>
  brand: string
  category: Category
  price: number
  discount?: number
  rating: number
  images: string[]
  stock: number
  badge?: 'luxury' | 'new' | 'bestseller'
}

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=70`

const P = {
  cream:   'photo-1522335789203-aaa0bdf829ab',
  perfume: 'photo-1541643600914-78b084683601',
  skin1:   'photo-1596462502278-27bfdc403348',
  lipstick:'photo-1620916566398-39f1143ab7be',
  brush:   'photo-1617897903246-719242758050',
  serum:   'photo-1608248543803-ba4f8c70ae0b',
  faceCr:  'photo-1629198688000-71f23e745b6e',
  nail:    'photo-1613454320437-0c228c8b1723',
  palette: 'photo-1631730486572-226d1f595b68',
  shampoo: 'photo-1596755389378-c31d21fd1273',
  perfume2:'photo-1526045478516-99145907023c',
  creamPk: 'photo-1512496015851-a90fb38ba796',
  lotion:  'photo-1585386959984-a4155224a1ad',
  found:   'photo-1556228720-195a672e8a03',
  mascara: 'photo-1590156206657-3d5c2b7a0a51',
  body:    'photo-1503236823255-94609f598e71',
}

export const products: Product[] = [
  // Skincare
  { id: 's1', category: 'skincare', brand: 'The Ordinary', price: 598500, discount: 25, rating: 4.9, stock: 24,
    images: [img(P.serum), img(P.skin1), img(P.cream)],
    title: { fa: 'سرم هیالورونیک اسید آبرسان ۳۰ میل', en: 'Hyaluronic Acid Hydrating Serum 30ml', ar: 'سيروم حمض الهيالورونيك المرطب ٣٠ مل' },
    badge: 'bestseller' },
  { id: 's2', category: 'skincare', brand: 'Biomarine', price: 1545000, discount: 22, rating: 4.4, stock: 12,
    images: [img(P.faceCr), img(P.cream)],
    title: { fa: 'کرم دور چشم کلاژن ضد پف', en: 'Collagen Anti-puff Eye Cream', ar: 'كريم العين المضاد للانتفاخ بالكولاجين' } },
  { id: 's3', category: 'skincare', brand: 'Vitaler', price: 438900, discount: 18, rating: 4.3, stock: 30,
    images: [img(P.skin1), img(P.serum)],
    title: { fa: 'تونر پاک کننده پوست مختلط', en: 'Toner for Combination Skin', ar: 'تونر البشرة المختلطة' } },
  { id: 's4', category: 'skincare', brand: 'La Roche-Posay', price: 985000, discount: 20, rating: 4.8, stock: 18,
    images: [img(P.creamPk), img(P.cream)],
    title: { fa: 'کرم ضد آفتاب SPF50 بی رنگ', en: 'Invisible SPF50 Sunscreen', ar: 'واقٍ شمسي شفاف SPF50' },
    badge: 'bestseller' },
  { id: 's5', category: 'skincare', brand: "Paula's Choice", price: 1120000, discount: 15, rating: 4.7, stock: 9,
    images: [img(P.cream), img(P.skin1)],
    title: { fa: 'لایه بردار AHA 10 درصد شب', en: '10% AHA Night Exfoliant', ar: 'مقشر ليلي AHA ١٠٪' } },
  { id: 's6', category: 'skincare', brand: 'The Ordinary', price: 489000, discount: 28, rating: 4.9, stock: 40,
    images: [img(P.serum), img(P.skin1)],
    title: { fa: 'سرم نیاسینامید ۱۰٪ + روی', en: 'Niacinamide 10% + Zinc Serum', ar: 'سيروم النياسيناميد ١٠٪ + الزنك' },
    badge: 'bestseller' },

  // Makeup
  { id: 'm1', category: 'makeup', brand: 'Huda Beauty', price: 1290000, discount: 15, rating: 4.7, stock: 20,
    images: [img(P.lipstick), img(P.palette)],
    title: { fa: 'رژ لب مایع مات مخملی رزگلد', en: 'Rose Gold Velvet Matte Liquid Lipstick', ar: 'أحمر شفاه سائل مخملي روزگولد' } },
  { id: 'm2', category: 'makeup', brand: 'Maybelline', price: 489000, discount: 20, rating: 4.5, stock: 50,
    images: [img(P.mascara), img(P.brush)],
    title: { fa: 'ریمل حجم دهنده پر پشت کننده', en: 'Volumizing Lash Mascara', ar: 'ماسكارا للرموش الكثيفة' } },
  { id: 'm3', category: 'makeup', brand: 'Estée Lauder', price: 2890000, discount: 10, rating: 4.8, stock: 8,
    images: [img(P.found), img(P.brush)],
    title: { fa: 'کرم پودر پوشش بالا ۳۵ گرم', en: 'Full-Coverage Foundation 35g', ar: 'كريم أساس كامل التغطية ٣٥غ' },
    badge: 'luxury' },
  { id: 'm4', category: 'makeup', brand: 'Real Techniques', price: 1890000, discount: 22, rating: 4.6, stock: 15,
    images: [img(P.brush), img(P.palette)],
    title: { fa: 'ست براش آرایشی حرفه ای ۱۲ عددی', en: 'Pro 12-Piece Makeup Brush Set', ar: 'مجموعة فرش احترافية ١٢ قطعة' } },
  { id: 'm5', category: 'makeup', brand: 'NARS', price: 2150000, discount: 12, rating: 4.7, stock: 11,
    images: [img(P.palette), img(P.lipstick)],
    title: { fa: 'هایلایتر پودری درخشان کننده', en: 'Powder Highlighter — Luminous', ar: 'هايلايتر بودرة ذو لمعة' } },
  { id: 'm6', category: 'makeup', brand: 'Essence', price: 189000, discount: 30, rating: 4.3, stock: 60,
    images: [img(P.nail), img(P.lipstick)],
    title: { fa: 'لاک ناخن ژله ای کوئیک درای', en: 'Quick-Dry Gel Nail Polish', ar: 'طلاء أظافر جل سريع الجفاف' } },

  // Perfume
  { id: 'p1', category: 'perfume', brand: 'Tom Ford', price: 8990000, discount: 10, rating: 4.9, stock: 4,
    images: [img(P.perfume), img(P.perfume2)],
    title: { fa: 'عطر ادو پرفیوم رز نویر ۱۰۰ میل', en: 'Rose Noir Eau de Parfum 100ml', ar: 'عطر روز نوار أو دو برفيوم ١٠٠ مل' },
    badge: 'luxury' },
  { id: 'p2', category: 'perfume', brand: 'Giorgio Armani', price: 5290000, discount: 15, rating: 4.8, stock: 7,
    images: [img(P.perfume2), img(P.perfume)],
    title: { fa: 'عطر زنانه مای وی ۵۰ میل', en: 'My Way Eau de Parfum 50ml', ar: 'عطر ماي واي ٥٠ مل' },
    badge: 'luxury' },
  { id: 'p3', category: 'perfume', brand: "Victoria's Secret", price: 1490000, discount: 25, rating: 4.6, stock: 22,
    images: [img(P.perfume), img(P.body)],
    title: { fa: 'ادو تویلت بدن اسپری ملایم', en: 'Body Mist — Soft Eau de Toilette', ar: 'رذاذ الجسم أو دو توالت' } },
  { id: 'p4', category: 'perfume', brand: 'Dior', price: 2890000, discount: 12, rating: 4.7, stock: 10,
    images: [img(P.perfume2)],
    title: { fa: 'عطر جیبی رز ۲۵ میل', en: 'Rose Pocket Perfume 25ml', ar: 'عطر الجيب الوردي ٢٥ مل' } },

  // Haircare
  { id: 'h1', category: 'haircare', brand: "L'Oréal Pro", price: 689000, discount: 18, rating: 4.6, stock: 35,
    images: [img(P.shampoo)],
    title: { fa: 'شامپو تقویت کننده کراتینه', en: 'Keratin Strengthening Shampoo', ar: 'شامبو الكيراتين المقوي' } },
  { id: 'h2', category: 'haircare', brand: 'Moroccanoil', price: 1390000, discount: 22, rating: 4.8, stock: 14,
    images: [img(P.shampoo), img(P.body)],
    title: { fa: 'ماسک مو آرگان ترمیم کننده', en: 'Argan Hair Repair Mask', ar: 'ماسك الأرغان لإصلاح الشعر' } },
  { id: 'h3', category: 'haircare', brand: 'Vitaler', price: 942000, discount: 25, rating: 4.5, stock: 20,
    images: [img(P.serum), img(P.shampoo)],
    title: { fa: 'سرم ضد ریزش مو تخصصی', en: 'Anti Hair-Loss Serum', ar: 'سيروم مضاد لتساقط الشعر' } },
  { id: 'h4', category: 'haircare', brand: 'Garnier', price: 389000, discount: 15, rating: 4.3, stock: 42,
    images: [img(P.shampoo)],
    title: { fa: 'روغن مو آبرسان درخشان کننده', en: 'Shine Hair Oil', ar: 'زيت الشعر اللامع' } },
]

export const categoriesMeta = [
  { id: 'skincare' as Category, icon: '🧴', color: 'from-brand-100 to-brand-200' },
  { id: 'makeup'   as Category, icon: '💄', color: 'from-rose-100 to-rose-200' },
  { id: 'perfume'  as Category, icon: '🌸', color: 'from-fuchsia-100 to-fuchsia-200' },
  { id: 'haircare' as Category, icon: '💇', color: 'from-amber-100 to-amber-200' },
]

export const brands = [
  "L'Oréal", 'Maybelline', 'Chanel', 'Dior', 'Estée Lauder', 'NARS',
  'Huda Beauty', 'Benefit', 'Vitaler', 'Biomarine', 'The Ordinary',
  'La Roche-Posay', 'Tom Ford', 'Armani', 'Moroccanoil',
]

export const articles = {
  fa: [
    { id: 'a1', title: 'راهنمای کامل روتین پوستی برای پوست چرب و جوش دار', excerpt: 'در این مقاله با روتین روزانه، محصولات مؤثر و ترکیبات کاربردی برای کنترل چربی پوست آشنا می‌شوید.', author: 'دکتر مهشید رضائی', read: '۸ دقیقه', image: img(P.skin1) },
    { id: 'a2', title: 'بهترین سرم‌های ضد چروک سال ۱۴۰۵', excerpt: 'مقایسه جامع سرم‌های ضد چروک برتر بر اساس ترکیبات، نحوه مصرف و قیمت.', author: 'پرستو پاسبان', read: '۱۲ دقیقه', image: img(P.cream) },
    { id: 'a3', title: 'تفاوت ضد آفتاب شیمیایی و فیزیکی', excerpt: 'راهنمای انتخاب ضد آفتاب مناسب هر نوع پوست.', author: 'بهاره شاه محمدی', read: '۶ دقیقه', image: img(P.creamPk) },
  ],
  en: [
    { id: 'a1', title: 'The complete skincare routine for oily, acne-prone skin', excerpt: 'Learn the daily routine, effective products and useful actives to control excess oil.', author: 'Dr. Mahshid Rezaei', read: '8 min', image: img(P.skin1) },
    { id: 'a2', title: 'Best anti-wrinkle serums of 2026 — comparison', excerpt: 'A comprehensive comparison of top anti-wrinkle serums by actives, usage and price.', author: 'Parasto Pasban', read: '12 min', image: img(P.cream) },
    { id: 'a3', title: 'Chemical vs physical sunscreen', excerpt: 'A practical guide to choosing the right SPF for every skin type.', author: 'Bahareh Shah', read: '6 min', image: img(P.creamPk) },
  ],
  ar: [
    { id: 'a1', title: 'روتين كامل للعناية بالبشرة الدهنية المعرضة لحب الشباب', excerpt: 'تعرفي على الروتين اليومي والمنتجات الفعالة للتحكم بالدهون.', author: 'د. مهشيد رضائي', read: '٨ دقائق', image: img(P.skin1) },
    { id: 'a2', title: 'أفضل سيرومات مضادة للتجاعيد لعام ٢٠٢٦', excerpt: 'مقارنة شاملة لأفضل السيرومات حسب المكونات والسعر.', author: 'برستو باسبان', read: '١٢ دقيقة', image: img(P.cream) },
    { id: 'a3', title: 'الفرق بين واقي الشمس الكيميائي والفيزيائي', excerpt: 'دليل عملي لاختيار الواقي المناسب لبشرتك.', author: 'بهاره شاه', read: '٦ دقائق', image: img(P.creamPk) },
  ],
}
