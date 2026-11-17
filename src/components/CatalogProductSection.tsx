import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import CatalogProductCard from "./CatalogProductCard";
import type { CatalogProduct } from "../types/catalog";
import { useI18n } from "../i18n";

type Props = {
  title: string;
  subtitle?: string;
  products: CatalogProduct[];
  viewAllTo?: string;
};

export default function CatalogProductSection({
  title,
  subtitle,
  products,
  viewAllTo = "/shop",
}: Props) {
  const { t, dir, lang } = useI18n();
  const scroller = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const scroll = (forward: boolean) => {
    const element = scroller.current;
    if (!element) return;

    const sign = (dir === "rtl" ? -1 : 1) * (forward ? 1 : -1);

    element.scrollBy({
      left: sign * 600,
      behavior: "smooth",
    });
  };

  const moreLabel =
    lang === "fa" ? "نمایش محصولات بیشتر" : lang === "ar" ? "عرض المزيد" : "Show more";
  const lessLabel =
    lang === "fa" ? "نمایش کمتر" : lang === "ar" ? "عرض أقل" : "Show less";

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
          <div>
            <h2
              className="text-xl font-extrabold text-ink-900"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {title}
            </h2>

            {subtitle && (
              <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={viewAllTo}
              className="hidden md:inline text-brand-500 text-sm hover:text-brand-700 ms-2"
            >
              {t("action.viewAll")}
            </Link>

            <button
              onClick={() => scroll(false)}
              className="hidden md:grid w-9 h-9 rounded-full border border-ink-100 hover:bg-sand place-items-center"
              aria-label="prev"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll(true)}
              className="hidden md:grid w-9 h-9 rounded-full border border-ink-100 hover:bg-sand place-items-center"
              aria-label="next"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="flex flex-col md:flex-row gap-4 p-4 md:p-5 md:overflow-x-auto no-scrollbar md:snap-x md:snap-mandatory"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`w-full md:w-auto md:shrink-0 md:snap-start ${
                index >= 4 && !showAll ? "hidden md:block" : ""
              }`}
            >
              <CatalogProductCard product={product} />
            </div>
          ))}
        </div>

        {products.length > 4 && (
          <div className="px-4 pb-5 flex justify-center md:hidden">
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="min-w-40 px-6 py-3 rounded-full border border-brand-200 text-brand-600 hover:bg-brand-50 text-sm font-semibold transition-colors"
              aria-expanded={showAll}
            >
              {showAll ? lessLabel : moreLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
