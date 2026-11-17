import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, UserCircle2 } from 'lucide-react'
import { articles } from '../data'
import { useI18n } from '../i18n'

const articleBody = {
  fa: {
    a1: [
      'پوست چرب معمولاً سبوم بیشتری تولید می‌کند و همین موضوع می‌تواند باعث برق افتادن پوست، بسته شدن منافذ و ایجاد جوش شود. با این حال، چربی پوست به معنی نیاز به شست‌وشوی مداوم یا استفاده از محصولات بسیار قوی نیست. هدف یک روتین خوب، متعادل نگه داشتن پوست و حفظ سد دفاعی طبیعی آن است.',
      'صبح را با یک شوینده ملایم و متناسب با پوست چرب شروع کنید. شست‌وشوی بیش از حد یا استفاده از شوینده‌های خشن ممکن است پوست را تحریک کند. پس از شست‌وشو، یک مرطوب‌کننده سبک و غیرکومدون‌زا انتخاب کنید؛ حتی پوست چرب هم برای حفظ رطوبت به مرطوب‌کننده نیاز دارد.',
      'در طول روز استفاده از ضدآفتاب با SPF 30 یا بالاتر و محافظت طیف وسیع را فراموش نکنید. اگر بافت‌های سنگین را دوست ندارید، سراغ فرمول‌های سبک، ژلی یا فلوئیدی بروید. هنگام حضور طولانی در فضای باز، ضدآفتاب را حدود هر دو ساعت و پس از تعریق یا شنا تمدید کنید.',
      'شب‌ها ابتدا آرایش و ضدآفتاب را به‌آرامی پاک کنید و سپس صورت را با شوینده بشویید. ترکیباتی مانند سالیسیلیک اسید ممکن است برای برخی پوست‌های چرب و مستعد جوش مفید باشند، اما بهتر است با دفعات کم شروع شوند. هم‌زمان چند محصول لایه‌بردار یا فعال را وارد روتین نکنید.',
      'برای ارزیابی نتیجه، به پوست فرصت بدهید و محصولات جدید را یکی‌یکی اضافه کنید تا بتوانید واکنش پوست را تشخیص دهید. اگر خشکی، سوزش یا قرمزی ایجاد شد، مصرف محصول محرک را متوقف کنید. در صورت وجود جوش‌های دردناک، عمیق یا ماندگار، تشخیص و درمان را به متخصص پوست بسپارید.'
    ],
    a2: [
      'سرم‌های ضدچروک گروهی از محصولات مراقبت از پوست هستند که با هدف بهبود ظاهر خطوط ریز، ناهمواری بافت و کدر بودن پوست طراحی می‌شوند. نتیجه استفاده از آن‌ها به نوع ترکیبات، غلظت، فرمولاسیون، شرایط پوست و استمرار مصرف بستگی دارد؛ بنابراین نباید انتظار تغییر فوری یا یکسان از همه محصولات داشت.',
      'رتینوئیدها از ترکیبات شناخته‌شده در مراقبت از پوست هستند و می‌توانند به بهبود ظاهر خطوط و بافت پوست کمک کنند. این گروه ممکن است در ابتدای مصرف خشکی یا تحریک ایجاد کند؛ بهتر است مصرف با دفعات کم و طبق دستور محصول آغاز شود. در دوران بارداری یا شیردهی درباره استفاده از رتینوئیدها با پزشک مشورت کنید.',
      'ویتامین C بیشتر به‌خاطر نقش آنتی‌اکسیدانی و کمک به شفاف‌تر دیده شدن پوست شناخته می‌شود. پپتیدها نیز در فرمول‌های مختلف برای پشتیبانی از ظاهر و حس پوست استفاده می‌شوند. هیالورونیک اسید یک ترکیب آبرسان است که به جذب و نگهداری آب در لایه سطحی پوست کمک می‌کند و می‌تواند ظاهر خطوط ناشی از خشکی را کمتر نمایان کند.',
      'هنگام انتخاب سرم، ابتدا نیاز اصلی پوست خود را مشخص کنید: آبرسانی، کدر بودن، خطوط ریز یا ناهمواری بافت. لازم نیست چند سرم فعال را هم‌زمان بخرید یا استفاده کنید. یک محصول مناسب که به‌درستی و منظم استفاده شود، معمولاً انتخاب ساده‌تر و قابل ارزیابی‌تری است.',
      'محصول جدید را ابتدا روی بخش کوچکی از پوست امتحان کنید و آن را به‌تدریج وارد برنامه کنید. در صورت بروز سوزش مداوم، قرمزی یا پوسته‌ریزی شدید، مصرف را متوقف کنید. استفاده روزانه از ضدآفتاب در کنار یک روتین ملایم، بخش مهمی از مراقبت برای حفظ ظاهر سالم پوست است.'
    ],
    a3: [
      'ضدآفتاب‌ها با هدف کاهش اثر پرتوهای فرابنفش بر پوست استفاده می‌شوند. ضدآفتاب‌های معدنی معمولاً از فیلترهایی مانند زینک اکساید و تیتانیوم دی‌اکساید بهره می‌برند؛ در مقابل، ضدآفتاب‌های آلی یا شیمیایی از فیلترهایی استفاده می‌کنند که پرتو فرابنفش را جذب و به شکل دیگری از انرژی تبدیل می‌کنند.',
      'یکی از تفاوت‌هایی که هنگام انتخاب احساس می‌شود، بافت محصول است. بعضی ضدآفتاب‌های معدنی ممکن است روی برخی رنگ‌های پوست رد سفیدی بیشتری باقی بگذارند، در حالی که بسیاری از فرمول‌های شیمیایی بافت سبک‌تر یا نامرئی‌تری دارند. البته این موضوع به فرمولاسیون و کیفیت محصول وابسته است و نمی‌توان درباره همه محصولات یک حکم یکسان داد.',
      'عدد SPF بیشتر به میزان محافظت در برابر UVB اشاره دارد؛ برای استفاده روزانه، محصولی با SPF 30 یا بالاتر و عبارت محافظت طیف وسیع انتخاب کنید تا در برابر UVA نیز محافظت داشته باشد. هیچ ضدآفتابی به‌تنهایی تمام پرتوها را مسدود نمی‌کند و مقدار مصرف در عملکرد واقعی محصول اهمیت زیادی دارد.',
      'ضدآفتاب را به مقدار کافی و پیش از قرار گرفتن در معرض نور خورشید استفاده کنید. اگر مدت زیادی بیرون هستید، تقریباً هر دو ساعت آن را تمدید کنید و پس از شنا، تعریق یا خشک کردن پوست با حوله نیز دوباره استفاده کنید. کلاه، سایه و لباس مناسب هم می‌توانند به محافظت بیشتر کمک کنند.',
      'در نهایت، بهترین ضدآفتاب محصولی است که با نوع پوست و سبک زندگی شما سازگار باشد و بتوانید هر روز به مقدار کافی از آن استفاده کنید. اگر پوست حساسی دارید یا محصولی باعث تحریک می‌شود، ترکیبات آن را بررسی کنید و برای انتخاب مناسب‌تر از متخصص پوست کمک بگیرید.'
    ]
  },
  en: {
    a1: [
      'Oily skin tends to produce more sebum, which can contribute to shine, clogged pores and breakouts. That does not mean it needs constant washing or harsh products. A useful routine aims to keep excess oil manageable while protecting the skin barrier and maintaining comfortable hydration.',
      'Begin the morning with a gentle cleanser made for your skin type. Washing too often or using an aggressive cleanser can leave skin irritated. Follow with a lightweight, non-comedogenic moisturizer. Oily skin still needs hydration, and skipping moisturizer may make a routine harder to tolerate.',
      'Use a broad-spectrum sunscreen with SPF 30 or higher every day. If rich textures feel uncomfortable, look for lightweight gel or fluid formulas. When spending extended time outdoors, reapply about every two hours and after swimming or heavy sweating.',
      'In the evening, gently remove makeup and sunscreen before cleansing. Ingredients such as salicylic acid may help some people with oily, blemish-prone skin, but introduce them gradually and follow the product directions. Avoid adding several exfoliating or active products at the same time.',
      'Give a new routine time and add products one at a time so you can identify what works for your skin. If persistent stinging, redness or irritation develops, stop the product causing the reaction. Deep, painful or ongoing acne is best assessed by a qualified dermatologist.'
    ],
    a2: [
      'Anti-wrinkle serums are designed to improve the appearance of concerns such as fine lines, uneven texture and dullness. Their results depend on the ingredients, concentration, formulation, skin condition and consistency of use. No serum produces an identical or instant result for everyone.',
      'Retinoids are among the best-known ingredients used to address the appearance of lines and skin texture. They can cause dryness or irritation when first introduced, so follow the product directions and begin gradually. If you are pregnant or breastfeeding, ask a healthcare professional before using retinoids.',
      'Vitamin C is valued for its antioxidant properties and its role in helping skin look brighter. Peptides appear in a range of formulas intended to support the look and feel of skin. Hyaluronic acid is a humectant that attracts water to the skin’s surface and can make dehydration lines look less noticeable.',
      'Choose a serum based on your main concern: hydration, dullness, fine lines or uneven texture. You do not need to layer several active serums at once. One well-chosen product used consistently is often easier to assess and more comfortable to maintain.',
      'Patch-test a new formula and introduce it gradually. Stop using it if you experience persistent burning, marked redness or significant peeling. Pairing a gentle routine with daily sunscreen is an important part of maintaining healthy-looking skin.'
    ],
    a3: [
      'Sunscreens help reduce the impact of ultraviolet radiation on the skin. Mineral formulas commonly use filters such as zinc oxide and titanium dioxide. Organic, often called chemical, formulas use filters that absorb UV radiation and convert the energy into another form.',
      'Texture is one of the differences people notice. Some mineral formulas can leave a visible white cast on certain skin tones, while many chemical formulas are designed to feel lighter or look more transparent. The result depends on the specific formula, so the category alone does not tell the whole story.',
      'The SPF number mainly indicates protection against UVB. For everyday use, choose broad-spectrum SPF 30 or higher so the product also offers UVA protection. No sunscreen blocks every ray, and applying enough product is essential to achieving the protection stated on the label.',
      'Apply sunscreen generously before going outdoors. If you remain outside, reapply about every two hours, and again after swimming, sweating or towel-drying. Shade, protective clothing and a wide-brimmed hat can provide additional support alongside sunscreen.',
      'The best sunscreen is one that suits your skin and routine well enough for you to use it every day in the recommended amount. If your skin is sensitive or a formula causes irritation, review its ingredients and ask a dermatologist for guidance.'
    ]
  },
  ar: {
    a1: [
      'تفرز البشرة الدهنية كمية أكبر من الزهم، وقد يؤدي ذلك إلى اللمعان وانسداد المسام وظهور الحبوب. لكن هذا لا يعني أنها تحتاج إلى الغسل المتكرر أو المنتجات القاسية. يهدف الروتين الجيد إلى تنظيم الدهون مع الحفاظ على حاجز البشرة ورطوبتها الطبيعية.',
      'ابدئي صباحك بغسول لطيف يناسب نوع بشرتك. فالغسل المفرط أو استخدام منظف قوي قد يسبب التهيج. بعد التنظيف استخدمي مرطباً خفيفاً لا يسد المسام؛ فالبشرة الدهنية تحتاج أيضاً إلى الترطيب للحفاظ على توازنها.',
      'استخدمي يومياً واقياً من الشمس واسع الطيف بعامل حماية SPF 30 أو أعلى. إذا كنت لا تفضلين القوام الغني، اختاري تركيبة خفيفة على شكل جل أو سائل. وعند البقاء خارج المنزل مدة طويلة، جددي الاستخدام كل ساعتين تقريباً وبعد السباحة أو التعرق.',
      'في المساء أزيلي المكياج وواقي الشمس بلطف ثم اغسلي الوجه. قد تفيد مكونات مثل حمض الساليسيليك بعض أنواع البشرة الدهنية المعرضة للحبوب، لكن أدخليها تدريجياً واتبعي تعليمات المنتج. تجنبي استخدام عدة مقشرات أو مكونات فعالة جديدة في الوقت نفسه.',
      'امنحي الروتين الجديد وقتاً كافياً وأضيفي المنتجات واحداً تلو الآخر لتتمكني من معرفة ما يناسب بشرتك. إذا ظهر احمرار أو تهيج مستمر، أوقفي المنتج المسبب. أما الحبوب العميقة أو المؤلمة أو المستمرة فيفضل تقييمها لدى طبيب الجلدية.'
    ],
    a2: [
      'صُممت سيرومات مقاومة التجاعيد لتحسين مظهر الخطوط الدقيقة وملمس البشرة والبهتان. وتعتمد النتائج على المكونات والتركيز والتركيبة وحالة البشرة والاستعمال المنتظم؛ لذلك لا ينبغي توقع نتيجة فورية أو متطابقة لدى الجميع.',
      'تُعد مشتقات الريتينويد من المكونات المعروفة لتحسين مظهر الخطوط وملمس البشرة. وقد تسبب الجفاف أو التهيج في بداية الاستخدام، لذا ابدئي تدريجياً واتبعي تعليمات المنتج. في الحمل أو الرضاعة، استشيري مختصاً صحياً قبل استخدام الريتينويدات.',
      'يُعرف فيتامين C بخصائصه المضادة للأكسدة ودوره في مساعدة البشرة على الظهور بمظهر أكثر إشراقاً. وتوجد الببتيدات في تركيبات مختلفة للعناية بمظهر البشرة. أما حمض الهيالورونيك فيساعد على جذب الماء إلى سطح الجلد، مما قد يجعل خطوط الجفاف أقل وضوحاً.',
      'اختاري السيروم وفق حاجتك الأساسية: الترطيب أو البهتان أو الخطوط الدقيقة أو تفاوت الملمس. ليس من الضروري وضع عدة سيرومات فعالة في الوقت نفسه؛ فمنتج واحد مناسب ومستعمل بانتظام قد يكون أسهل في المتابعة.',
      'اختبري المنتج الجديد على مساحة صغيرة وأدخليه تدريجياً في روتينك. أوقفيه إذا ظهر حرقان مستمر أو احمرار واضح أو تقشر شديد. ويساعد الجمع بين روتين لطيف وواقي الشمس اليومي في الحفاظ على مظهر صحي للبشرة.'
    ],
    a3: [
      'تساعد واقيات الشمس على تقليل تأثير الأشعة فوق البنفسجية على البشرة. وتستخدم التركيبات المعدنية عادةً مرشحات مثل أكسيد الزنك وثاني أكسيد التيتانيوم، بينما تستخدم التركيبات العضوية أو الكيميائية مرشحات تمتص الأشعة فوق البنفسجية وتحول طاقتها.',
      'يُعد الملمس من أبرز الفروق التي يلاحظها المستخدم. فقد تترك بعض التركيبات المعدنية أثراً أبيض على بعض ألوان البشرة، بينما صُممت تركيبات كيميائية كثيرة لتكون أخف وأكثر شفافية. لكن النتيجة تعتمد على تركيبة المنتج نفسه وليس على نوعه فقط.',
      'يشير رقم SPF أساساً إلى مستوى الحماية من أشعة UVB. للاستخدام اليومي اختاري واقياً واسع الطيف بعامل SPF 30 أو أعلى ليشمل الحماية من UVA أيضاً. لا يحجب أي واقٍ جميع الأشعة، كما أن وضع كمية كافية ضروري للحصول على الحماية الموضحة على العبوة.',
      'ضعي كمية مناسبة من واقي الشمس قبل الخروج. وإذا بقيت في الخارج، جددي استخدامه كل ساعتين تقريباً وبعد السباحة أو التعرق أو تجفيف البشرة بالمنشفة. ويمكن للظل والملابس الواقية والقبعة أن تضيف حماية إلى جانب الواقي.',
      'أفضل واقٍ هو الذي يناسب بشرتك وروتينك بحيث تستطيعين استخدامه يومياً بالكمية الموصى بها. إذا كانت بشرتك حساسة أو سببت تركيبة معينة تهيجاً، راجعي مكوناتها واستشيري طبيب الجلدية لاختيار بديل مناسب.'
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
