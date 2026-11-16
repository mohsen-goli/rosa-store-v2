import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import CatalogProductCard from "../components/CatalogProductCard";
import { useCatalog } from "../CatalogContext";
import { useStore } from "../store";
import { useI18n } from "../i18n";

export default function Wishlist() {
  const { wishlist, toggleWish } = useStore();
  const { products, loading } = useCatalog();
  const { t, lang } = useI18n();

  const items = products.filter(
    (product) => wishlist.includes(product.id) && product.isActive,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
      <h1
        className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-6"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {t("action.wishlist")}
      </h1>

      {loading ? (
        <div className="py-16 text-center text-ink-500">
          {lang === "fa"
            ? "در حال بارگذاری..."
            : lang === "ar"
              ? "جارٍ التحميل..."
              : "Loading..."}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-ink-100 rounded-3xl p-12 text-center">
          <Heart className="w-14 h-14 mx-auto text-ink-300 mb-4" />

          <p className="text-ink-500">{t("cart.empty")}</p>

          <Link
            to="/shop"
            className="inline-block mt-4 text-brand-500 hover:text-brand-600"
          >
            {t("cart.emptyCta")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {items.map((product) => (
            <div key={product.id} className="relative">
              <CatalogProductCard product={product} />

              <button
                type="button"
                onClick={() => toggleWish(product.id)}
                aria-label={
                  lang === "fa"
                    ? "حذف از علاقه‌مندی‌ها"
                    : lang === "ar"
                      ? "إزالة من المفضلة"
                      : "Remove from wishlist"
                }
                title={
                  lang === "fa"
                    ? "حذف از علاقه‌مندی‌ها"
                    : lang === "ar"
                      ? "إزالة من المفضلة"
                      : "Remove from wishlist"
                }
                className="absolute top-12 inset-e-3 z-20 w-9 h-9 rounded-full bg-white/95 border border-ink-100 shadow-sm grid place-items-center hover:bg-brand-50 transition"
              >
                <Heart className="w-4 h-4 fill-brand-500 text-brand-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
