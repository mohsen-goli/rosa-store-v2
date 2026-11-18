import { Heart, Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import { useI18n } from "../i18n";
import { useCatalog } from "../CatalogContext";
import { useCart } from "../CartContext";
import { useStore } from "../store";
import type { CatalogProduct, Lang } from "../types/catalog";

type Props = {
  product: CatalogProduct;
};

const badgeLabels: Record<string, Record<Lang, string>> = {
  luxury: { fa: "لوکس", en: "Luxury", ar: "فاخر" },
  new: { fa: "جدید", en: "New", ar: "جديد" },
  bestseller: { fa: "پرفروش", en: "Bestseller", ar: "الأكثر مبيعاً" },
};

function formatAmount(amount: number, lang: Lang) {
  const locale = lang === "fa" ? "fa-IR" : lang === "ar" ? "ar" : "en-US";

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function CatalogProductCard({ product }: Props) {
  const { lang, t } = useI18n();
  const { market } = useCatalog();
  const { addItem } = useCart();
  const { toast } = useStore();

  const variant =
    product.variants.find(
      (item) =>
        item.isActive &&
        item.prices.some((price) => price.market === market),
    ) ?? product.variants[0];

  const price = variant?.prices.find((item) => item.market === market);

  const discount = variant?.discountPercent ?? 0;
  const finalPrice = price ? price.amount * (1 - discount / 100) : null;

  const outOfStock = !variant || !variant.isActive || variant.stock <= 0;
  const image = product.images[0];
  const translation = product.translations[lang];

  const currencyLabel =
    market === "iran"
      ? lang === "fa"
        ? "ریال"
        : lang === "ar"
          ? "ريال"
          : "IRR"
      : "USD";

  const badgeLabel = product.badge
    ? badgeLabels[product.badge]?.[lang]
    : undefined;

  const handleAddToCart = () => {
    if (!variant || !price || outOfStock) return;

    const added = addItem(product.id, variant.id, 1);

    if (added) {
      toast("added");
      return;
    }

    toast(
      lang === "fa"
        ? "افزودن محصول ممکن نیست؛ موجودی یا قیمت را بررسی کنید."
        : lang === "ar"
          ? "تعذرت إضافة المنتج. تحقق من المخزون والسعر."
          : "Could not add product. Check stock and price.",
      "error",
    );
  };

  return (
    <article className="group relative bg-white rounded-2xl border border-ink-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/40 transition-all overflow-hidden flex flex-col min-w-52.5 w-52.5">
      {badgeLabel && (
        <span className="absolute top-3 inset-s-3 z-10 bg-ink-900 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
          {badgeLabel}
        </span>
      )}

      {discount > 0 && (
        <span className="absolute top-3 inset-e-3 z-10 bg-brand-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          {formatAmount(discount, lang)}% {t("action.off")}
        </span>
      )}

      <Link
        to={`/product/${product.id}`}
        className="aspect-square bg-gradient-to-br from-sand to-white overflow-hidden block"
      >
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt[lang] || translation.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-ink-300">
            <ShoppingBag className="w-10 h-10" />
          </div>
        )}
      </Link>

      <div className="p-3.5 flex-1 flex flex-col gap-2">
        <div className="text-[11px] text-brand-600 font-semibold">
          {product.brandName}
        </div>

        <Link
          to={`/product/${product.id}`}
          className="text-[13px] text-ink-900 font-semibold leading-snug line-clamp-2 min-h-9 hover:text-brand-600"
        >
          {translation.title}
        </Link>

        <div className="flex items-center gap-1 text-[11px] text-ink-500">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{formatAmount(product.rating, lang)}</span>
        </div>

        <div className="mt-auto pt-2 border-t border-dashed border-ink-100 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {price && discount > 0 && (
              <div className="text-[11px] text-ink-300 line-through">
                {formatAmount(price.amount, lang)}
              </div>
            )}

            {finalPrice !== null ? (
              <div className="text-sm font-extrabold text-ink-900">
                {formatAmount(finalPrice, lang)}
                <span className="text-[10px] font-normal text-ink-500 ms-1">
                  {currencyLabel}
                </span>
              </div>
            ) : (
              <div className="text-xs text-ink-400">
                {lang === "fa"
                  ? "قیمت اعلام نشده"
                  : lang === "ar"
                    ? "السعر غير متوفر"
                    : "Price unavailable"}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={outOfStock || !price}
            onClick={handleAddToCart}
            aria-label={t("action.addCart")}
            title={t("action.addCart")}
            className="w-9 h-9 shrink-0 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white grid place-items-center transition"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {outOfStock && (
          <div className="text-[10px] text-red-500">
            {t("product.outStock")}
          </div>
        )}
      </div>
    </article>
  );
}
