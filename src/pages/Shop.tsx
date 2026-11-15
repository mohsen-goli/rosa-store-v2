import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, Search as SearchIcon, Loader2 } from "lucide-react";

import CatalogProductCard from "../components/CatalogProductCard";
import { useI18n } from "../i18n";
import { useCatalog } from "../CatalogContext";
import type { CatalogProduct, Category, Market } from "../types/catalog";

type SortKey = "newest" | "cheapest" | "expensive" | "mostRated" | "mostOff";

const CATS: Category[] = ["skincare", "makeup", "perfume", "haircare"];
const PAGE_SIZE = 12;

function getProductPrice(product: CatalogProduct, market: Market) {
  const variant = product.variants.find((item) => item.isActive);

  const price = variant?.prices.find((item) => item.market === market);

  if (!price) return null;

  return price.amount * (1 - (variant?.discountPercent ?? 0) / 100);
}

function formatAmount(amount: number, lang: string) {
  const locale = lang === "fa" ? "fa-IR" : lang === "ar" ? "ar" : "en-US";

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function Shop() {
  const { t, lang } = useI18n();
  const { products, market, loading, error } = useCatalog();

  const { cat } = useParams();
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";

  const [sort, setSort] = useState<SortKey>("newest");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setMaxPrice(null);
    setVisible(PAGE_SIZE);
  }, [market, cat, q]);

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  );

  const availablePrices = useMemo(
    () =>
      activeProducts
        .map((product) => getProductPrice(product, market))
        .filter((price): price is number => price !== null),
    [activeProducts, market],
  );

  const maxAvailablePrice = Math.max(0, ...availablePrices);

  const filtered = useMemo(() => {
    let list = activeProducts.filter((product) => {
      if (cat && CATS.includes(cat as Category) && product.category !== cat) {
        return false;
      }

      if (q) {
        const needle = q.trim().toLocaleLowerCase();

        const matches =
          product.brandName.toLocaleLowerCase().includes(needle) ||
          product.translations[lang].title
            .toLocaleLowerCase()
            .includes(needle) ||
          product.translations.fa.title.includes(q) ||
          product.translations.ar.title.includes(q) ||
          product.translations.en.title.toLocaleLowerCase().includes(needle);

        if (!matches) return false;
      }

      const price = getProductPrice(product, market);

      if (price === null) return false;

      if (maxPrice !== null && price > maxPrice) return false;

      return true;
    });

    switch (sort) {
      case "cheapest":
        list.sort(
          (a, b) =>
            (getProductPrice(a, market) ?? 0) -
            (getProductPrice(b, market) ?? 0),
        );
        break;

      case "expensive":
        list.sort(
          (a, b) =>
            (getProductPrice(b, market) ?? 0) -
            (getProductPrice(a, market) ?? 0),
        );
        break;

      case "mostRated":
        list.sort((a, b) => b.rating - a.rating);
        break;

      case "mostOff":
        list.sort((a, b) => {
          const aDiscount = Math.max(
            0,
            ...a.variants.map((v) => v.discountPercent),
          );
          const bDiscount = Math.max(
            0,
            ...b.variants.map((v) => v.discountPercent),
          );
          return bDiscount - aDiscount;
        });
        break;

      case "newest":
      default:
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return list;
  }, [activeProducts, cat, q, lang, market, maxPrice, sort]);

  const title = cat ? t(`nav.${cat}`) : t("shop.title");

  const currencyLabel =
    market === "iran"
      ? lang === "fa"
        ? "ریال"
        : lang === "ar"
          ? "ريال"
          : "IRR"
      : "USD";

  const noMarketPrices =
    !loading && activeProducts.length > 0 && availablePrices.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1
            className="text-2xl md:text-3xl font-extrabold text-ink-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {q ? `${t("shop.search")} "${q}"` : title}
          </h1>

          <p className="text-ink-500 text-sm mt-1">
            {formatAmount(filtered.length, lang)} {t("shop.found")}
          </p>
        </div>

        {q && (
          <button
            onClick={() => setParams({})}
            className="text-brand-500 text-sm"
          >
            {t("action.reset")}
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-5">
        <aside className="bg-white border border-ink-100 rounded-2xl p-5 h-max lg:sticky lg:top-28">
          <div className="flex items-center gap-2 font-bold text-sm mb-4">
            <SlidersHorizontal className="w-4 h-4" />
            {t("action.filter")}
          </div>

          <div>
            <div className="text-xs font-bold text-ink-700 mb-2">
              {t("shop.cats")}
            </div>

            <div className="flex flex-col gap-1">
              <Link
                to="/shop"
                className={`px-3 py-1.5 rounded-full text-sm ${
                  !cat
                    ? "bg-brand-500 text-white"
                    : "hover:bg-sand text-ink-700"
                }`}
              >
                {t("nav.shop")}
              </Link>

              {CATS.map((category) => (
                <Link
                  key={category}
                  to={`/shop/${category}`}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    cat === category
                      ? "bg-brand-500 text-white"
                      : "hover:bg-sand text-ink-700"
                  }`}
                >
                  {t(`nav.${category}`)}
                </Link>
              ))}
            </div>
          </div>

          {maxAvailablePrice > 0 && (
            <div className="mt-5">
              <div className="text-xs font-bold text-ink-700 mb-2">
                {t("shop.price")}
              </div>

              <input
                type="range"
                min={0}
                max={maxAvailablePrice}
                step={Math.max(1, Math.round(maxAvailablePrice / 100))}
                value={Math.min(
                  maxPrice ?? maxAvailablePrice,
                  maxAvailablePrice,
                )}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-brand-500"
              />

              <div className="text-xs text-ink-500 mt-1">
                ≤ {formatAmount(maxPrice ?? maxAvailablePrice, lang)}{" "}
                {currencyLabel}
              </div>

              {maxPrice !== null && (
                <button
                  onClick={() => setMaxPrice(null)}
                  className="text-xs text-brand-500 mt-2"
                >
                  {t("action.reset")}
                </button>
              )}
            </div>
          )}

          <div className="mt-5">
            <div className="text-xs font-bold text-ink-700 mb-2">
              {t("action.sort")}
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full bg-sand border border-ink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400"
            >
              <option value="newest">{t("sort.newest")}</option>
              <option value="cheapest">{t("sort.cheapest")}</option>
              <option value="expensive">{t("sort.expensive")}</option>
              <option value="mostRated">{t("sort.mostRated")}</option>
              <option value="mostOff">{t("sort.mostOff")}</option>
            </select>
          </div>
        </aside>

        <div>
          {loading && products.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
            </div>
          ) : error ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center text-red-500">
              {lang === "fa"
                ? "دریافت محصولات با مشکل مواجه شد."
                : lang === "ar"
                  ? "حدث خطأ أثناء تحميل المنتجات."
                  : "Failed to load products."}
            </div>
          ) : noMarketPrices ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center">
              <p className="text-ink-700 font-bold">
                {lang === "fa"
                  ? "هنوز قیمتی برای این بازار ثبت نشده است."
                  : lang === "ar"
                    ? "لم تتم إضافة أسعار لهذا السوق بعد."
                    : "No prices have been added for this market yet."}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center">
              <SearchIcon className="w-10 h-10 mx-auto text-ink-300 mb-3" />
              <p className="text-ink-700 font-bold">{t("shop.empty")}</p>

              <Link to="/shop" className="inline-block mt-4 text-brand-500">
                {t("action.reset")}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.slice(0, visible).map((product) => (
                  <div
                    key={product.id}
                    className="[&>article]:!w-full [&>article]:!min-w-0"
                  >
                    <CatalogProductCard product={product} />
                  </div>
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setVisible((value) => value + PAGE_SIZE)}
                    className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 h-11 rounded-full"
                  >
                    {t("action.viewAll")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
