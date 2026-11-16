import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../CartContext";
import { useCatalog } from "../CatalogContext";
import { useI18n } from "../i18n";

function formatMoney(amount: number, currency: "IRR" | "USD", lang: string) {
  return new Intl.NumberFormat(
    lang === "fa" ? "fa-IR" : lang === "ar" ? "ar" : "en-US",
    {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "USD" ? 2 : 0,
    },
  ).format(amount);
}

export default function Cart() {
  const { items, setItemQty, removeItem } = useCart();
  const { getProduct, market, currentMarketSettings } = useCatalog();
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const cartProducts = items.map((item) => {
    const product = getProduct(item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);

    const price = variant?.prices.find((p) => p.market === market);

    const unitPrice = price
      ? price.amount * (1 - (variant?.discountPercent ?? 0) / 100)
      : null;

    return {
      item,
      product,
      variant,
      price,
      unitPrice,
      lineTotal: unitPrice !== null ? unitPrice * item.qty : null,
    };
  });

  const validProducts = cartProducts.filter((item) => item.lineTotal !== null);

  const subtotal = validProducts.reduce(
    (total, item) => total + (item.lineTotal ?? 0),
    0,
  );

  const currency = currentMarketSettings?.currency ?? "IRR";
  const shippingFee = currentMarketSettings?.shippingFee ?? 0;
  const freeShippingThreshold =
    currentMarketSettings?.freeShippingThreshold ?? null;

  const hasFreeShipping =
    freeShippingThreshold !== null && subtotal >= freeShippingThreshold;

  const shipping = hasFreeShipping ? 0 : shippingFee;
  const total = subtotal + shipping;

  const hasInvalidItems = cartProducts.some(
    (item) =>
      !item.product ||
      !item.variant ||
      item.unitPrice === null ||
      !item.variant.isActive ||
      item.variant.stock < item.item.qty,
  );

  const handleQuantity = (
    productId: string,
    variantId: string,
    qty: number,
  ) => {
    const success = setItemQty(productId, variantId, qty);

    if (!success) {
      window.alert(
        lang === "fa"
          ? "موجودی کافی نیست."
          : lang === "ar"
            ? "الكمية غير متوفرة."
            : "Not enough stock available.",
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-14 h-14 mx-auto text-ink-300 mb-4" />

        <h1 className="text-xl font-extrabold text-ink-900">
          {t("cart.empty")}
        </h1>

        <Link
          to="/shop"
          className="inline-block mt-5 bg-brand-500 hover:bg-brand-600 text-white px-6 h-11 rounded-full font-bold leading-11"
        >
          {t("cart.emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
      <h1
        className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-6"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {t("cart.title")}
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          {cartProducts.map(
            ({ item, product, variant, unitPrice, lineTotal }) => {
              if (!product || !variant) {
                return (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="p-4 border-b border-ink-100 text-sm text-red-600"
                  >
                    {lang === "fa"
                      ? "این محصول دیگر در دسترس نیست."
                      : "This product is no longer available."}

                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="ml-3 underline"
                    >
                      {t("action.remove")}
                    </button>
                  </div>
                );
              }

              const translation = product.translations[lang];
              const image =
                product.images.find((img) => img.isPrimary) ??
                product.images[0];

              const optionLabel = Object.entries(variant.optionValues)
                .filter(([, value]) => value !== "Default")
                .map(([, value]) => value)
                .join(" / ");

              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 border-b border-ink-100 last:border-0"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-sand shrink-0"
                  >
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={image.alt?.[lang] ?? translation.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-brand-600 font-semibold">
                      {product.brandName}
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="block font-semibold text-sm text-ink-900 line-clamp-2 hover:text-brand-600"
                    >
                      {translation.title}
                    </Link>

                    {optionLabel && (
                      <div className="text-xs text-ink-500 mt-1">
                        {optionLabel}
                      </div>
                    )}

                    <div className="text-sm font-bold mt-1">
                      {unitPrice !== null
                        ? formatMoney(unitPrice, currency, lang)
                        : lang === "fa"
                          ? "قیمت موجود نیست"
                          : "Price unavailable"}
                    </div>

                    {variant.stock < item.qty && (
                      <div className="text-xs text-red-600 mt-1">
                        {lang === "fa"
                          ? "موجودی کافی نیست."
                          : "Insufficient stock."}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-sand rounded-full p-1">
                    <button
                      onClick={() =>
                        handleQuantity(product.id, variant.id, item.qty - 1)
                      }
                      className="w-7 h-7 rounded-full bg-white border border-ink-100 grid place-items-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-7 text-center text-sm font-bold">
                      {item.qty}
                    </span>

                    <button
                      disabled={item.qty >= variant.stock}
                      onClick={() =>
                        handleQuantity(product.id, variant.id, item.qty + 1)
                      }
                      className="w-7 h-7 rounded-full bg-white border border-ink-100 grid place-items-center disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id, variant.id)}
                    className="w-9 h-9 rounded-full hover:bg-sand grid place-items-center text-ink-500 hover:text-brand-500"
                    aria-label={t("action.remove")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            },
          )}
        </div>

        <aside className="bg-white border border-ink-100 rounded-2xl p-5 h-max sticky top-28">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">{t("cart.subtotal")}</span>
              <span className="font-bold">
                {formatMoney(subtotal, currency, lang)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-500">{t("cart.shipping")}</span>
              <span className="font-bold">
                {shipping === 0
                  ? t("cart.free")
                  : formatMoney(shipping, currency, lang)}
              </span>
            </div>

            <div className="border-t border-ink-100 pt-3 flex justify-between items-end">
              <span className="text-ink-500">{t("cart.total")}</span>

              <span className="font-extrabold text-lg text-brand-600">
                {formatMoney(total, currency, lang)}
              </span>
            </div>
          </div>

          <button
            disabled={hasInvalidItems || validProducts.length === 0}
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full bg-brand-500 hover:bg-brand-600 text-white font-bold h-12 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("action.checkout")}
          </button>

          {hasInvalidItems && (
            <p className="text-xs text-red-600 mt-3 text-center">
              {lang === "fa"
                ? "لطفاً موجودی و قیمت محصولات سبد را بررسی کنید."
                : "Please check product prices and stock."}
            </p>
          )}

          <Link
            to="/shop"
            className="mt-3 block text-center text-sm text-ink-500 hover:text-brand-600"
          >
            {t("action.continueShop")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
