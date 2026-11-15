import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
  Loader2,
} from "lucide-react";

import { useCatalog } from "../CatalogContext";
import { useCart } from "../CartContext";
import { useStore } from "../store";
import { useI18n } from "../i18n";
import CatalogProductCard from "../components/CatalogProductCard";
import { localizeDigits } from "../lib/utils";

function formatMarketPrice(
  amount: number,
  currency: "IRR" | "USD",
  lang: string,
) {
  const locale = lang === "fa" ? "fa-IR" : lang === "ar" ? "ar" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  }).format(amount);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, getProduct, market, loading } = useCatalog();
  const { addItem } = useCart();

  // موقت: علاقه‌مندی تا زمان مهاجرت Wishlist از Store قدیمی استفاده می‌کند.
  const { toggleWish, isWished } = useStore();

  const { t, lang } = useI18n();

  const product = id ? getProduct(id) : undefined;

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [cartMessage, setCartMessage] = useState<"added" | "error" | null>(
    null,
  );

  useEffect(() => {
    setSelectedVariantId("");
    setQty(1);
    setImg(0);
    setCartMessage(null);
  }, [id]);

  const activeVariants =
    product?.variants.filter((variant) => variant.isActive) ?? [];

  const selectedVariant =
    activeVariants.find((variant) => variant.id === selectedVariantId) ??
    activeVariants[0];

  const marketPrice = selectedVariant?.prices.find(
    (price) => price.market === market,
  );

  const finalPrice = marketPrice
    ? Math.round(
        marketPrice.amount * (1 - selectedVariant.discountPercent / 100),
      )
    : null;

  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const hasPrice = finalPrice !== null;

  const translation = product?.translations[lang];
  const images = product?.images ?? [];
  const currentImage = images[img] ?? images[0];

  const related =
    products
      .filter(
        (item) =>
          item.isActive &&
          item.category === product?.category &&
          item.id !== product?.id,
      )
      .slice(0, 6) ?? [];

  const wished = product ? isWished(product.id) : false;

  function handleAddToCart(goToCheckout = false) {
    if (!product || !selectedVariant || !hasPrice || outOfStock) return;

    const success = addItem(product.id, selectedVariant.id, qty);

    if (!success) {
      setCartMessage("error");
      return;
    }

    setCartMessage("added");

    if (goToCheckout) {
      navigate("/cart");
    }
  }

  if (loading && !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
      </div>
    );
  }

  if (!product || !translation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">404 — Product not found</p>
        <Link to="/shop" className="text-brand-500 mt-3 inline-block">
          {t("action.continueShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <nav className="text-xs text-ink-500 mb-5 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600">
          {t("nav.home")}
        </Link>
        <span>·</span>
        <Link to="/shop" className="hover:text-brand-600">
          {t("nav.shop")}
        </Link>
        <span>·</span>
        <Link to={`/shop/${product.category}`} className="hover:text-brand-600">
          {t(`nav.${product.category}`)}
        </Link>
      </nav>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 bg-white border border-ink-100 rounded-3xl p-6 md:p-8">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-sand to-white border border-ink-100">
            {currentImage ? (
              <img
                src={currentImage.url}
                alt={currentImage.alt[lang] || translation.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-ink-400">
                No image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setImg(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                    index === img ? "border-brand-500" : "border-ink-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt[lang] || ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-brand-600 font-bold">
            {product.brandName}
          </div>

          <h1
            className="text-2xl md:text-3xl font-extrabold text-ink-900 mt-2 leading-snug"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {translation.title}
          </h1>

          <div className="flex items-center gap-3 mt-3 text-sm">
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              {localizeDigits(product.rating, lang)}
            </span>

            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                outOfStock
                  ? "bg-ink-100 text-ink-500"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {outOfStock
                ? t("product.outStock")
                : `${t("product.inStock")} · ${localizeDigits(
                    selectedVariant.stock,
                    lang,
                  )}`}
            </span>
          </div>

          {activeVariants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-ink-800 mb-3">
                {lang === "fa"
                  ? "انتخاب مدل محصول"
                  : lang === "ar"
                    ? "اختر نوع المنتج"
                    : "Select product variant"}
              </h3>

              <div className="flex flex-wrap gap-2">
                {activeVariants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const options = Object.entries(variant.optionValues)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(" / ");

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQty(1);
                        setCartMessage(null);
                      }}
                      className={`rounded-xl border px-4 py-2 text-sm transition ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-ink-100 hover:border-brand-300"
                      }`}
                    >
                      {options || variant.sku}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-end gap-3">
            {selectedVariant?.discountPercent > 0 && marketPrice && (
              <span className="text-sm text-ink-300 line-through">
                {formatMarketPrice(
                  marketPrice.amount,
                  marketPrice.currency,
                  lang,
                )}
              </span>
            )}
            <span className="text-3xl font-extrabold text-ink-900">
              {hasPrice && marketPrice
                ? formatMarketPrice(
                    finalPrice as number,
                    marketPrice.currency,
                    lang,
                  )
                : lang === "fa"
                  ? "قیمت موجود نیست"
                  : lang === "ar"
                    ? "السعر غير متوفر"
                    : "Price unavailable"}
            </span>
            {selectedVariant?.discountPercent > 0 && (
              <span className="ms-auto bg-brand-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {localizeDigits(selectedVariant.discountPercent, lang)}%{" "}
                {t("action.off")}
              </span>
            )}
          </div>

          {selectedVariant && (
            <div className="mt-2 text-xs text-ink-400">
              SKU: {selectedVariant.sku}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-sand rounded-full p-1">
              <button
                onClick={() => setQty((current) => Math.max(1, current - 1))}
                className="w-8 h-8 rounded-full bg-white border border-ink-100 grid place-items-center"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-8 text-center font-bold">
                {localizeDigits(qty, lang)}
              </span>

              <button
                onClick={() =>
                  setQty((current) =>
                    Math.min(selectedVariant?.stock ?? 1, current + 1),
                  )
                }
                disabled={outOfStock || qty >= (selectedVariant?.stock ?? 0)}
                className="w-8 h-8 rounded-full bg-white border border-ink-100 grid place-items-center disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              disabled={outOfStock || !hasPrice}
              onClick={() => handleAddToCart()}
              className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white font-bold h-12 rounded-full transition"
            >
              {t("action.addCart")}
            </button>

            <button
              onClick={() => toggleWish(product.id)}
              className={`w-12 h-12 rounded-full border grid place-items-center transition ${
                wished
                  ? "bg-brand-50 border-brand-200 text-brand-500"
                  : "border-ink-100 hover:bg-sand"
              }`}
              aria-label={t("action.wishlist")}
            >
              <Heart className={`w-4 h-4 ${wished ? "fill-brand-500" : ""}`} />
            </button>
          </div>

          {cartMessage && (
            <p
              className={`mt-3 text-sm ${
                cartMessage === "added" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {cartMessage === "added"
                ? lang === "fa"
                  ? "محصول به سبد خرید اضافه شد."
                  : lang === "ar"
                    ? "تمت إضافة المنتج إلى السلة."
                    : "Product added to cart."
                : lang === "fa"
                  ? "افزودن محصول ممکن نیست؛ موجودی یا قیمت را بررسی کنید."
                  : lang === "ar"
                    ? "تعذرت إضافة المنتج. تحقق من المخزون والسعر."
                    : "Could not add product. Check stock and price."}
            </p>
          )}

          <button
            disabled={outOfStock || !hasPrice}
            onClick={() => handleAddToCart(true)}
            className="mt-3 bg-ink-900 hover:bg-ink-700 disabled:bg-ink-300 text-white font-bold h-12 rounded-full transition"
          >
            {t("action.buy")}
          </button>

          <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-sand rounded-xl p-3">
              <Truck className="w-4 h-4 text-brand-500" />
              {t("service.ship")}
            </div>

            <div className="flex items-center gap-2 bg-sand rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              {t("service.auth")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <h3
            className="font-extrabold mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("product.desc")}
          </h3>
          <p className="text-sm text-ink-500 leading-relaxed">
            {translation.description}
          </p>
        </div>

        <div className="bg-white border border-ink-100 rounded-2xl p-6">
          <h3
            className="font-extrabold mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("product.features")}
          </h3>

          <ul className="text-sm text-ink-700 space-y-2">
            {translation.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h3
            className="text-xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t(`nav.${product.category}`)}
          </h3>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {related.map((item) => (
              <div key={item.id} className="min-w-[210px]">
                <CatalogProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
