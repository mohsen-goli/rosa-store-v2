import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";

import { useCart } from "../CartContext";
import { useCatalog } from "../CatalogContext";
import { useStore } from "../store";
import { useI18n } from "../i18n";
import { createOrder } from "../lib/db";

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

type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postal: string;
  note: string;
};

export default function Checkout() {
  const { items, clearMarketCart } = useCart();
  const { getProduct, market, currentMarketSettings } = useCatalog();
  const { user, supabaseReady } = useStore();
  const { t, lang } = useI18n();
  const nav = useNavigate();

  const [done, setDone] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    city: "",
    address: "",
    postal: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const currency = currentMarketSettings?.currency ?? (market === "iran" ? "IRR" : "USD");
  const cartLines = useMemo(
    () =>
      items.map((item) => {
        const product = getProduct(item.productId);
        const variant = product?.variants.find((entry) => entry.id === item.variantId);
        const marketPrice = variant?.prices.find((price) => price.market === market);
        const unitPrice = marketPrice
          ? marketPrice.amount * (1 - (variant?.discountPercent ?? 0) / 100)
          : null;
        return {
          item,
          product,
          variant,
          unitPrice,
          lineTotal: unitPrice === null ? null : unitPrice * item.qty,
        };
      }),
    [items, getProduct, market],
  );

  const invalidItems = cartLines.some(
    ({ product, variant, item, unitPrice }) =>
      !product ||
      !product.isActive ||
      !variant ||
      !variant.isActive ||
      unitPrice === null ||
      variant.stock < item.qty,
  );

  const subtotal = cartLines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0);
  const shippingFee = currentMarketSettings?.shippingFee ?? 0;
  const freeThreshold = currentMarketSettings?.freeShippingThreshold ?? null;
  const shipping = freeThreshold !== null && subtotal >= freeThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitErr(null);

    const nextErrors: Record<string, boolean> = {};
    if (!form.name.trim()) nextErrors.name = true;
    if (form.phone.trim().length < 7) nextErrors.phone = true;
    if (!form.city.trim()) nextErrors.city = true;
    if (form.address.trim().length < 6) nextErrors.address = true;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setSubmitErr(
        lang === "fa"
          ? "لطفاً نام، شماره تماس، شهر و آدرس معتبر را بررسی کنید. یادداشت سفارش اختیاری است."
          : "Please check your name, phone, city and address. Order note is optional.",
      );
      return;
    }
    if (!items.length) return;
    if (invalidItems) {
      setSubmitErr(lang === "fa" ? "موجودی یا قیمت یکی از محصولات تغییر کرده است. سبد خرید را بررسی کنید." : "A product price or stock level has changed. Please review your cart.");
      return;
    }
    if (!supabaseReady || !user) {
      setSubmitErr(lang === "fa" ? "برای ثبت سفارش ابتدا وارد حساب کاربری شوید." : "Please sign in before placing your order.");
      return;
    }

    setSubmitting(true);
    try {
      const code = "ROS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const orderItems = cartLines.map(({ item, unitPrice }) => ({
        productId: item.productId,
        qty: item.qty,
        price: Math.round((unitPrice ?? 0) * 100) / 100,
      }));

      const orderId = await createOrder({
        code,
        subtotal,
        shipping,
        total,
        customer: {
          ...form,
          market,
          currency,
        },
        items: orderItems,
      });

      clearMarketCart();
      setDone(orderId);
    } catch (error) {
      console.error("[ROSA checkout] order submission failed:", error);
      const details =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : error instanceof Error
            ? error.message
            : String(error);
      setSubmitErr(
        lang === "fa"
          ? `ثبت سفارش انجام نشد: ${details || "خطای نامشخص"}`
          : `Order could not be placed: ${details || "Unknown error"}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full grid place-items-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-serif)" }}>{t("checkout.success")}</h1>
        <p className="text-ink-500 text-sm">{t("checkout.successDesc")}</p>
        <div className="mt-3 inline-block bg-sand px-4 py-2 rounded-xl font-bold" dir="ltr">{done}</div>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => nav("/")} className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 h-11 rounded-full">{t("checkout.backHome")}</button>
          <Link to="/account" className="bg-sand hover:bg-ink-100 font-bold px-6 h-11 rounded-full grid place-items-center">{t("account.orders")}</Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">{t("cart.empty")}</p>
        <Link to="/shop" className="inline-block mt-4 text-brand-500">{t("cart.emptyCta")}</Link>
      </div>
    );
  }

  const field = (name: keyof CheckoutForm, label: string, type = "text") => (
    <label className="block">
      <span className="text-xs font-bold text-ink-700 mb-1 block">{label}</span>
      <input
        type={type}
        value={form[name]}
        onChange={(event) => setForm((previous) => ({ ...previous, [name]: event.target.value }))}
        className={`w-full bg-sand border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 ${errors[name] ? "border-brand-500" : "border-ink-100"}`}
      />
    </label>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
      <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-6" style={{ fontFamily: "var(--font-serif)" }}>{t("checkout.title")}</h1>

      {supabaseReady && !user && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-sm flex items-center justify-between gap-4">
          <span>{t("account.needLogin")}</span>
          <Link to="/account" className="bg-amber-800 text-white text-xs font-bold px-4 h-9 rounded-full grid place-items-center">{t("account.login")}</Link>
        </div>
      )}

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-5">
        <div className="bg-white border border-ink-100 rounded-2xl p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {field("name", t("checkout.name"))}
            {field("phone", t("checkout.phone"), "tel")}
            {field("email", t("checkout.email"), "email")}
            {field("city", t("checkout.city"))}
          </div>
          <label className="block">
            <span className="text-xs font-bold text-ink-700 mb-1 block">{t("checkout.address")}</span>
            <textarea rows={3} value={form.address} onChange={(event) => setForm((previous) => ({ ...previous, address: event.target.value }))} className={`w-full bg-sand border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 ${errors.address ? "border-brand-500" : "border-ink-100"}`} />
          </label>
          {field("postal", t("checkout.postal"))}
          <label className="block">
            <span className="text-xs font-bold text-ink-700 mb-1 block">{t("checkout.note")}</span>
            <textarea rows={2} value={form.note} onChange={(event) => setForm((previous) => ({ ...previous, note: event.target.value }))} className="w-full bg-sand border border-ink-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
          </label>
        </div>

        <aside className="bg-white border border-ink-100 rounded-2xl p-5 h-max">
          <h3 className="font-extrabold text-sm mb-4">{t("checkout.summary")}</h3>
          <div className="space-y-3 text-sm mb-4">
            {cartLines.map(({ item, product, lineTotal }) => (
              <div key={item.variantId} className="flex justify-between gap-3">
                <span className="text-ink-700 line-clamp-2">{product?.translations[lang].title ?? item.productId} × {item.qty}</span>
                <span className="font-semibold whitespace-nowrap">{lineTotal === null ? "—" : formatMoney(lineTotal, currency, lang)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-ink-100 pt-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-500">{t("cart.subtotal")}</span><span className="font-bold">{formatMoney(subtotal, currency, lang)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">{t("cart.shipping")}</span><span className="font-bold">{shipping === 0 ? t("cart.free") : formatMoney(shipping, currency, lang)}</span></div>
            <div className="flex justify-between items-end border-t border-ink-100 pt-3">
              <span className="text-ink-500">{t("cart.total")}</span>
              <span className="font-extrabold text-lg text-brand-600">{formatMoney(total, currency, lang)}</span>
            </div>
          </div>
          {invalidItems && <p className="mt-3 text-xs text-red-600">{lang === "fa" ? "موجودی یا قیمت محصولات سبد نیاز به بررسی دارد." : "Please review product prices and stock."}</p>}
          {submitErr && <p className="mt-3 text-xs text-brand-600 break-words">{submitErr}</p>}
          <button type="submit" disabled={submitting || invalidItems} className="mt-5 w-full bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white font-bold h-12 rounded-full flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting
              ? (lang === "fa" ? "در حال ثبت سفارش..." : "Placing order...")
              : t("action.placeOrder")}
          </button>
          <p className="mt-3 text-[11px] text-ink-500 text-center">{t("checkout.pay")}</p>
        </aside>
      </form>
    </div>
  );
}
