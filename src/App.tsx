import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toaster from "./components/Toaster";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Magazine from "./pages/Magazine";
import MagazineArticle from "./pages/MagazineArticle";
import Contact from "./pages/Contact";
import About from "./pages/About";

import { I18nProvider } from "./i18n";
import { CatalogProvider } from "./CatalogContext";
import { CartProvider } from "./CartContext";
import { StoreProvider } from "./store";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

function Shell() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <TopBar />
      <Header />

      <ScrollToTop />

      <main className="flex-1 pb-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:cat" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/magazine/:id" element={<MagazineArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <CatalogProvider>
        <CartProvider>
          <StoreProvider>
            <HashRouter>
              <Shell />
            </HashRouter>
          </StoreProvider>
        </CartProvider>
      </CatalogProvider>
    </I18nProvider>
  );
}
