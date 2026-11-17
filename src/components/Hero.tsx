import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

const slides = [
  {
    id: "beauty",
    image:
      "https://rilwptahhvipusiwfjks.supabase.co/storage/v1/object/public/banners/rosa-hero-beauty.webp",
    link: "/shop",
    text: {
      en: {
        tag: "THE WORLD OF ROSA",
        title: "Beauty Is Your Signature.",
        desc: "Express your beauty. Celebrate your individuality.",
        cta: "DISCOVER BEAUTY",
      },
      fa: {
        tag: "دنیای زیبایی رزا",
        title: "زیبایی، امضای توست.",
        desc: "زیبایی منحصربه‌فرد خودت را کشف کن و بدرخش.",
        cta: "کشف دنیای زیبایی",
      },
      ar: {
        tag: "عالم ROSA",
        title: "جمالكِ هو توقيعك.",
        desc: "عبّري عن جمالك واحتفي بتفرّدك.",
        cta: "اكتشفي الجمال",
      },
    },
  },
  {
    id: "fragrance",
    image:
      "https://rilwptahhvipusiwfjks.supabase.co/storage/v1/object/public/banners/rosa-hero-fragrance.webp",
    link: "/shop/perfume",
    text: {
      en: {
        tag: "A SCENT TO REMEMBER",
        title: "Make Every Moment Memorable.",
        desc: "Find the fragrance that tells your story.",
        cta: "EXPLORE FRAGRANCES",
      },
      fa: {
        tag: "رایحه‌ای فراموش‌نشدنی",
        title: "هر لحظه را ماندگار کن.",
        desc: "رایحه‌ای پیدا کن که داستان تو را روایت کند.",
        cta: "کشف عطرها",
      },
      ar: {
        tag: "عطر لا يُنسى",
        title: "اجعلي كل لحظة مميزة.",
        desc: "اكتشفي العطر الذي يروي قصتك.",
        cta: "اكتشفي العطور",
      },
    },
  },
  {
    id: "makeup",
    image:
      "https://rilwptahhvipusiwfjks.supabase.co/storage/v1/object/public/banners/rosa-hero-makeup.webp",
    link: "/shop/makeup",
    text: {
      en: {
        tag: "EXPRESS YOURSELF",
        title: "Unveil Your Beauty.",
        desc: "Everything you need to express your own style.",
        cta: "EXPLORE MAKEUP",
      },
      fa: {
        tag: "سبک خودت را بساز",
        title: "زیبایی خودت را آشکار کن.",
        desc: "هر آنچه برای خلق استایل منحصربه‌فردت نیاز داری.",
        cta: "کشف محصولات آرایشی",
      },
      ar: {
        tag: "عبّري عن نفسك",
        title: "أبرزي جمالك.",
        desc: "كل ما تحتاجينه للتعبير عن أسلوبك الخاص.",
        cta: "اكتشفي المكياج",
      },
    },
  },
  {
    id: "skincare",
    image:
      "https://rilwptahhvipusiwfjks.supabase.co/storage/v1/object/public/banners/rosa-hero-skincare.webp",
    link: "/shop/skincare",
    text: {
      en: {
        tag: "LOVE YOUR SKIN",
        title: "Your Skin, Our Passion.",
        desc: "Discover skincare that makes every day feel special.",
        cta: "EXPLORE SKINCARE",
      },
      fa: {
        tag: "عاشق پوستت باش",
        title: "مراقبت از پوست، هنر ماست.",
        desc: "با محصولات مراقبتی، هر روز به پوستت بیشتر اهمیت بده.",
        cta: "کشف محصولات پوستی",
      },
      ar: {
        tag: "أحبي بشرتك",
        title: "العناية ببشرتك شغفنا.",
        desc: "اكتشفي منتجات العناية التي تجعل كل يوم مميزاً.",
        cta: "اكتشفي العناية بالبشرة",
      },
    },
  },
];

export default function Hero() {
  const { dir, lang } = useI18n();
  const nav = useNavigate();
  const [i, setI] = useState(0);

  const isRTL = dir === "rtl";
  const currentSlide = slides[i];
  const copy =
    currentSlide.text[lang as keyof typeof currentSlide.text] ??
    currentSlide.text.en;

  const next = () => setI((current) => (current + 1) % slides.length);
  const previous = () =>
    setI((current) => (current - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = window.setInterval(next, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const ArrowNext = isRTL ? ArrowLeft : ArrowRight;
  const ArrowPrevious = isRTL ? ArrowRight : ArrowLeft;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-5 md:pt-7">
      <div
        className="relative isolate overflow-hidden rounded-2xl md:rounded-3xl min-h-[430px] md:min-h-[490px] bg-neutral-900 text-white shadow-xl"
        dir={dir}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === i ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-70"
              style={{ transform: isRTL ? "scaleX(-1) scale(1.1)" : "scale(1.1)" }}
            />
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 w-full h-full object-contain object-center"
              style={{
                transform: isRTL ? "scaleX(-1)" : "scaleX(1)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        ))}

        <div
          className="absolute inset-0"
          style={{
            background: isRTL
              ? "linear-gradient(to left, rgba(15,12,13,0.72) 0%, rgba(15,12,13,0.38) 38%, rgba(15,12,13,0.04) 75%)"
              : "linear-gradient(to right, rgba(15,12,13,0.72) 0%, rgba(15,12,13,0.38) 38%, rgba(15,12,13,0.04) 75%)",
          }}
        />

        <div
          className={`relative z-10 flex min-h-[430px] md:min-h-[490px] items-center px-7 py-14 md:px-16 ${
            isRTL ? "justify-start" : "justify-start"
          }`}
        >
          <div className="max-w-xl w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 text-[10px] md:text-xs tracking-[0.18em] mb-6">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {copy.tag}
            </div>

            <h1
              key={`${currentSlide.id}-title`}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.2] mb-5 max-w-xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {copy.title}
            </h1>

            <p
              key={`${currentSlide.id}-desc`}
              className="text-white/85 text-sm md:text-base leading-8 max-w-md mb-8"
            >
              {copy.desc}
            </p>

            <button
              onClick={() => nav(currentSlide.link)}
              className="group inline-flex items-center gap-3 bg-white text-neutral-900 hover:bg-brand-100 px-7 h-12 rounded-full font-bold text-xs md:text-sm transition-all duration-300 shadow-lg"
            >
              {copy.cta}
              <ArrowNext className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="absolute z-20 bottom-5 inset-x-6 md:inset-x-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={previous}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-white/40 bg-black/20 hover:bg-white hover:text-black backdrop-blur-md flex items-center justify-center transition"
            >
              <ArrowPrevious size={17} />
            </button>

            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-white/40 bg-black/20 hover:bg-white hover:text-black backdrop-blur-md flex items-center justify-center transition"
            >
              <ArrowNext size={17} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setI(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === i
                    ? "w-9 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
