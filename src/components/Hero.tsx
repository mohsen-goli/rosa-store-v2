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
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  const goTo = (index: number) => {
    if (index === i) return;
    setPreviousIndex(i);
    setI(index);
  };

  const isRTL = dir === "rtl";
  const currentSlide = slides[i];
  const copy =
    currentSlide.text[lang as keyof typeof currentSlide.text] ??
    currentSlide.text.en;

  const next = () => goTo((i + 1) % slides.length);
  const previous = () => goTo((i - 1 + slides.length) % slides.length);

  // Give each slide more time, then crossfade gently into the next one.
  useEffect(() => {
    const timer = window.setTimeout(next, 16000);
    return () => window.clearTimeout(timer);
  }, [i]);

  useEffect(() => {
    if (previousIndex === null) return;
    const timer = window.setTimeout(() => setPreviousIndex(null), 2500);
    return () => window.clearTimeout(timer);
  }, [previousIndex]);

  const ArrowNext = isRTL ? ArrowLeft : ArrowRight;
  const ArrowPrevious = isRTL ? ArrowRight : ArrowLeft;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-5 md:pt-7">
      <div
        className="relative isolate overflow-hidden rounded-2xl md:rounded-3xl text-white shadow-xl"
        dir={dir}
      >
        {/* The image keeps its original aspect ratio: no crop and no filler background. */}
        {previousIndex !== null && (
          <img
            key={`previous-${slides[previousIndex].id}`}
            src={slides[previousIndex].image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{ transform: isRTL ? "scaleX(-1)" : "none" }}
          />
        )}
        <img
          key={currentSlide.id}
          src={currentSlide.image}
          alt={copy.title}
          className="hero-slide-fade relative z-[1] block h-auto w-full"
          style={{
            transform: isRTL ? "scaleX(-1)" : "none",
            backfaceVisibility: "hidden",
          }}
        />

        <div className="absolute inset-0 z-10 flex items-center px-4 py-3 sm:px-7 sm:py-5 md:px-16 md:py-10">
          <div className="max-w-xl w-full">
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/15 px-4 py-2 text-[10px] md:text-xs tracking-[0.18em] mb-3 md:mb-6 drop-shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {copy.tag}
            </div>

            <h1
              key={`${currentSlide.id}-title`}
              className="text-lg sm:text-3xl md:text-6xl font-bold leading-tight mb-1 sm:mb-3 md:mb-5 max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {copy.title}
            </h1>

            <p
              key={`${currentSlide.id}-desc`}
              className="hidden sm:block text-white/95 text-xs md:text-base leading-7 max-w-md mb-3 md:mb-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
            >
              {copy.desc}
            </p>

            <button
              onClick={() => nav(currentSlide.link)}
              className="group inline-flex items-center gap-2 sm:gap-3 bg-white text-neutral-900 hover:bg-brand-100 px-3 sm:px-6 md:px-7 h-8 sm:h-10 md:h-12 rounded-full font-bold text-[9px] sm:text-xs md:text-sm transition-all duration-300 shadow-lg"
            >
              {copy.cta}
              <ArrowNext className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="absolute z-20 bottom-2 sm:bottom-4 inset-x-3 sm:inset-x-6 md:inset-x-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={previous}
              aria-label="Previous slide"
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-white/50 bg-black/25 hover:bg-white hover:text-black flex items-center justify-center transition"
            >
              <ArrowPrevious size={15} />
            </button>

            <button
              onClick={next}
              aria-label="Next slide"
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-white/50 bg-black/25 hover:bg-white hover:text-black flex items-center justify-center transition"
            >
              <ArrowNext size={15} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === i
                    ? "w-6 sm:w-9 bg-white"
                    : "w-1.5 sm:w-2 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
