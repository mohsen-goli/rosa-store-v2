import { useRef } from "react";
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
  const { t, dir } = useI18n();
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (forward: boolean) => {
    const element = scroller.current;
    if (!element) return;

    const sign = (dir === "rtl" ? -1 : 1) * (forward ? 1 : -1);

    element.scrollBy({
      left: sign * 600,
      behavior: "smooth",
    });
  };

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
              className="w-9 h-9 rounded-full border border-ink-100 hover:bg-sand grid place-items-center"
              aria-label="prev"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll(true)}
              className="w-9 h-9 rounded-full border border-ink-100 hover:bg-sand grid place-items-center"
              aria-label="next"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="flex gap-3 p-5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start">
              <CatalogProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
