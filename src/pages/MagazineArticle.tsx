import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, UserCircle2 } from 'lucide-react'
import { articles } from '../data'
import { useI18n } from '../i18n'

const articleBody = {
  fa: {
    a1: [
      'یک روتین مؤثر برای پوست چرب و مستعد جوش، لزوماً طولانی یا پیچیده نیست. مهم‌ترین اصل، پاک‌سازی ملایم و استفاده منظم از محصولاتی است که با نیاز پوست هماهنگ باشند.',
      'صبح‌ها صورت را با شوینده ملایم بشویید و از مرطوب‌کننده سبک و ضدآفتاب با طیف وسیع استفاده کنید. شب‌ها نیز پس از پاک‌سازی، محصولات درمانی را به‌آرامی و مطابق دستور مصرف به روتین اضافه کنید.',
      'از شروع هم‌زمان چند ماده فعال خودداری کنید. هر محصول جدید را جداگانه وارد روتین کنید و اگر جوش‌ها شدید، دردناک یا ماندگار هستند، برای انتخاب درمان مناسب با متخصص پوست مشورت کنید.'
    ],
    a2: [
      'سرم‌های ضدچروک می‌توانند به بهبود ظاهر خطوط ریز، بافت و شفافیت پوست کمک کنند؛ اما نتیجه به ترکیبات، غلظت، فرمولاسیون و استمرار مصرف بستگی دارد.',
      'رتینوئیدها، ویتامین C، پپتیدها و هیالورونیک اسید از ترکیبات رایج در محصولات مراقبت از پوست هستند. هرکدام نقش متفاوتی دارند و لازم نیست همه آن‌ها را هم‌زمان استفاده کنید.',
      'سرم را متناسب با نوع پوست و تحمل آن انتخاب کنید، ابتدا تست حساسیت انجام دهید و در طول روز ضدآفتاب را فراموش نکنید. برای پوست حساس یا شرایط خاص، نظر متخصص پوست بهترین راهنماست.'
    ],
    a3: [
      'ضدآفتاب‌های فیزیکی معمولاً از فیلترهای معدنی مانند زینک اکساید و تیتانیوم دی‌اکساید استفاده می‌کنند؛ ضدآفتاب‌های شیمیایی از فیلترهایی بهره می‌برند که پرتو فرابنفش را جذب می‌کنند.',
      'هر دو گروه، در صورت داشتن پوشش مناسب و استفاده صحیح، می‌توانند از پوست در برابر اشعه‌های فرابنفش محافظت کنند. تفاوت در بافت، رد سفیدی، سازگاری با پوست و ترجیح شخصی است.',
      'محصولی با SPF 30 یا بالاتر و محافظت طیف وسیع انتخاب کنید. مقدار کافی بزنید و هنگام حضور در فضای باز، تقریباً هر دو ساعت و پس از شنا یا تعریق آن را تمدید کنید.'
    ]
  },
  en: {
    a1: [
      'An effective routine for oily, acne-prone skin does not need to be long or complicated. Start with gentle cleansing and choose products that match your skin’s needs.',
      'In the morning, use a mild cleanser, a lightweight moisturizer and broad-spectrum sunscreen. At night, cleanse again and introduce targeted treatments gradually, following their directions.',
      'Avoid starting several active ingredients at once. Add new products one at a time, and consult a dermatologist if breakouts are severe, painful or persistent.'
    ],
    a2: [
      'Anti-wrinkle serums may improve the appearance of fine lines, texture and radiance. Results depend on the ingredients, formulation, concentration and consistent use.',
      'Retinoids, vitamin C, peptides and hyaluronic acid are common skincare ingredients, each with a different purpose. You do not need to use every active ingredient at the same time.',
      'Choose a formula that suits your skin and tolerance, patch-test new products and use sunscreen during the day. A dermatologist can help with sensitive skin or specific concerns.'
    ],
    a3: [
      'Mineral sunscreens generally use filters such as zinc oxide and titanium dioxide. Chemical sunscreens use filters that absorb ultraviolet radiation.',
      'Both types can protect skin when they offer suitable coverage and are applied correctly. Texture, white cast, skin compatibility and personal preference often guide the choice.',
      'Choose broad-spectrum SPF 30 or higher, apply generously and reapply about every two hours outdoors, and after swimming or sweating.'
    ]
  },
  ar: {
    a1: [
      'لا يحتاج الروتين الفعال للبشرة الدهنية والمعرضة للحبوب إلى خطوات كثيرة. ابدئي بالتنظيف اللطيف واختاري منتجات تناسب احتياجات بشرتك.',
      'في الصباح استخدمي منظفاً لطيفاً ومرطباً خفيفاً وواقياً واسع الطيف من الشمس. وفي المساء نظفي البشرة وأضيفي المنتجات العلاجية تدريجياً وفق تعليماتها.',
      'تجنبي إدخال عدة مكونات فعالة في الوقت نفسه. أضيفي كل منتج جديد بمفرده، واستشيري طبيب الجلدية إذا كانت الحبوب شديدة أو مؤلمة أو مستمرة.'
    ],
    a2: [
      'قد تساعد سيرومات مقاومة التجاعيد على تحسين مظهر الخطوط الدقيقة وملمس البشرة وإشراقها. وتعتمد النتائج على المكونات والتركيبة والتركيز والاستعمال المنتظم.',
      'تُستخدم مشتقات الريتينويد وفيتامين C والببتيدات وحمض الهيالورونيك في منتجات العناية بالبشرة، ولكل منها وظيفة مختلفة. ليس من الضروري استعمالها كلها معاً.',
      'اختاري تركيبة تناسب بشرتك، واختبري المنتج قبل استعماله بانتظام، ولا تنسي واقي الشمس نهاراً. ويمكن لطبيب الجلدية مساعدتك عند وجود حساسية أو مشكلات خاصة.'
    ],
    a3: [
      'تعتمد واقيات الشمس المعدنية غالباً على أكسيد الزنك وثاني أكسيد التيتانيوم، بينما تستخدم الواقيات الكيميائية مرشحات تمتص الأشعة فوق البنفسجية.',
      'يمكن لكلا النوعين حماية البشرة عند اختيار تغطية مناسبة واستعمال المنتج بالطريقة الصحيحة. ويختلفان في الملمس والأثر الأبيض ومدى ملاءمتهما للبشرة والتفضيل الشخصي.',
      'اختاري واقياً واسع الطيف بعامل حماية SPF 30 أو أعلى، وضعي كمية كافية وجدديه كل ساعتين تقريباً عند الخروج، وبعد السباحة أو التعرق.'
    ]
  }
}

export default function MagazineArticle() {
  const { id } = useParams()
  const { lang, dir } = useI18n()
  const article = articles[lang].find(item => item.id === id)
  const paragraphs = (articleBody[lang] as Record<string, string[]>)[id ?? '']
  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft

  if (!article || !paragraphs) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900 mb-5">{lang === 'fa' ? 'مقاله پیدا نشد' : lang === 'ar' ? 'المقال غير موجود' : 'Article not found'}</h1>
        <Link to="/magazine" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-white font-bold">
          <BackArrow className="w-4 h-4" /> {lang === 'fa' ? 'بازگشت به مجله' : lang === 'ar' ? 'العودة إلى المجلة' : 'Back to Magazine'}
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-4 pt-8 pb-16">
      <Link to="/magazine" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 mb-6">
        <BackArrow className="w-4 h-4" /> {lang === 'fa' ? 'بازگشت به مجله' : lang === 'ar' ? 'العودة إلى المجلة' : 'Back to Magazine'}
      </Link>
      <div className="overflow-hidden rounded-3xl aspect-[16/9] bg-sand">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>
      <div className="max-w-3xl mx-auto pt-8">
        <div className="flex items-center gap-4 text-xs text-ink-500 mb-4">
          <span className="inline-flex items-center gap-1"><UserCircle2 className="w-4 h-4" /> {article.author}</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {article.read}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-ink-900 mb-5" style={{fontFamily:'var(--font-serif)'}}>{article.title}</h1>
        <p className="text-base md:text-lg leading-9 text-ink-600 font-medium border-s-2 border-brand-400 ps-5 mb-8">{article.excerpt}</p>
        <div className="space-y-6 text-sm md:text-base leading-9 text-ink-700">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </article>
  )
}
