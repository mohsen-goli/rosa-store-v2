import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { useCart } from "../CartContext";
import { localizeDigits } from "../lib/utils";
import LangSwitcher from "./LangSwitcher";

const navItems: { to: string; key: string }[] = [
  { to: "/", key: "nav.home" },
  { to: "/shop", key: "nav.shop" },
  { to: "/shop/skincare", key: "nav.skincare" },
  { to: "/shop/makeup", key: "nav.makeup" },
  { to: "/shop/perfume", key: "nav.perfume" },
  { to: "/shop/haircare", key: "nav.haircare" },
];

export default function Header() {
  const { t, lang } = useI18n();
  const { wishlist, user } = useStore();
  const { itemCount } = useCart();

  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-ink-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-4 lg:gap-6">
        <button
          className="lg:hidden h-10 w-10 grid place-items-center rounded-full hover:bg-sand"
          onClick={() => setMenuOpen(true)}
          aria-label="menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white shadow-lg shadow-brand-200">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 3c-3 3-5 5-5 8a5 5 0 1 0 10 0c0-3-2-5-5-8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="14" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div className="leading-tight hidden sm:block">
            <div className="text-xl font-extrabold text-ink-900">
              {t("brand.name")}
            </div>
            <div className="text-[11px] text-ink-500 -mt-0.5">
              {t("brand.tag")}
            </div>
          </div>
        </Link>

        <form onSubmit={onSearch} className="flex-1 max-w-2xl hidden md:block">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder={t("action.searchPlace")}
              className="w-full bg-sand border border-ink-100 rounded-full ps-10 pe-24 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white transition"
            />

            <button
              type="submit"
              className="absolute end-1 top-1/2 -translate-y-1/2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 h-9 rounded-full transition"
            >
              {t("action.search")}
            </button>
          </div>
        </form>

        <div className="ms-auto flex items-center gap-1">
          <LangSwitcher />

          <Link
            to="/account"
            className="h-10 px-3 rounded-full hover:bg-sand flex items-center gap-1.5 text-sm text-ink-700"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user ? user.name : t("action.login")}
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="h-10 w-10 rounded-full hover:bg-sand grid place-items-center relative"
            aria-label={t("action.wishlist")}
          >
            <Heart className="w-4 h-4 text-ink-700" />

            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-500 text-white text-[10px] grid place-items-center">
                {localizeDigits(wishlist.length, lang)}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="h-10 px-3 rounded-full bg-brand-50 hover:bg-brand-100 flex items-center gap-2 text-sm text-brand-700 font-semibold"
          >
            <ShoppingBag className="w-4 h-4" />

            <span>{localizeDigits(itemCount, lang)}</span>

            <span className="hidden sm:inline">{t("action.cart")}</span>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={onSearch} className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder={t("action.searchPlace")}
            className="w-full bg-sand border border-ink-100 rounded-full ps-10 pe-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white transition"
          />
        </div>
      </form>

      {/* Desktop nav */}
      <nav className="hidden lg:block border-t border-ink-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-1 text-sm">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 h-9 flex items-center rounded-full hover:bg-sand text-ink-700 hover:text-brand-600 transition"
            >
              {t(n.key)}
            </Link>
          ))}

          <Link
            to="/magazine"
            className="ms-auto px-3 h-9 flex items-center rounded-full hover:bg-sand text-ink-700 hover:text-brand-600"
          >
            {t("nav.magazine")}
          </Link>

          <Link
            to="/contact"
            className="px-3 h-9 flex items-center rounded-full hover:bg-sand text-ink-700 hover:text-brand-600"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute start-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl p-5 flex flex-col gap-2 fade-up">
            <div className="flex items-center justify-between mb-3">
              <div className="font-extrabold text-brand-700">
                {t("brand.name")}
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full grid place-items-center hover:bg-sand"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-sand text-ink-700"
              >
                {t(n.key)}
              </Link>
            ))}

            <Link
              to="/magazine"
              onClick={() => setMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-sand text-ink-700"
            >
              {t("nav.magazine")}
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-sand text-ink-700"
            >
              {t("nav.contact")}
            </Link>

            <div className="mt-4 border-t border-ink-100 pt-4">
              <LangSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
