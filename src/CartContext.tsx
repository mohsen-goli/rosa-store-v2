import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useCatalog } from "./CatalogContext";
import type { CartItem } from "./types/catalog";

const STORAGE_KEY = "rosa:v2:cart";

type CartContextValue = {
  items: CartItem[];
  allItems: CartItem[];
  itemCount: number;
  addItem: (productId: string, variantId: string, qty?: number) => boolean;
  setItemQty: (productId: string, variantId: string, qty: number) => boolean;
  removeItem: (productId: string, variantId: string) => void;
  clearMarketCart: () => void;
  clearAllCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      return (
        item !== null &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        typeof item.variantId === "string" &&
        (item.market === "iran" || item.market === "international") &&
        Number.isInteger(item.qty) &&
        item.qty > 0
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { market, getProduct } = useCatalog();
  const [allItems, setAllItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allItems));
    } catch (error) {
      console.warn("[rosa] cart storage failed:", error);
    }
  }, [allItems]);

  const items = useMemo(
    () => allItems.filter((item) => item.market === market),
    [allItems, market],
  );

  const addItem = useCallback(
    (productId: string, variantId: string, qty = 1): boolean => {
      if (!Number.isInteger(qty) || qty < 1) return false;

      const product = getProduct(productId);
      const variant = product?.variants.find((item) => item.id === variantId);

      if (
        !product ||
        !product.isActive ||
        !variant ||
        !variant.isActive ||
        variant.stock < 1 ||
        !variant.prices.some((price) => price.market === market)
      ) {
        return false;
      }

      const existing = allItems.find(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          item.market === market,
      );

      const nextQty = (existing?.qty ?? 0) + qty;

      if (nextQty > variant.stock) return false;

      setAllItems((previous) => {
        const found = previous.some(
          (item) =>
            item.productId === productId &&
            item.variantId === variantId &&
            item.market === market,
        );

        if (found) {
          return previous.map((item) =>
            item.productId === productId &&
            item.variantId === variantId &&
            item.market === market
              ? { ...item, qty: nextQty }
              : item,
          );
        }

        return [
          ...previous,
          { productId, variantId, market, qty },
        ];
      });

      return true;
    },
    [allItems, getProduct, market],
  );

  const setItemQty = useCallback(
    (productId: string, variantId: string, qty: number): boolean => {
      if (!Number.isInteger(qty)) return false;

      if (qty <= 0) {
        setAllItems((previous) =>
          previous.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId &&
                item.market === market
              ),
          ),
        );
        return true;
      }

      const product = getProduct(productId);
      const variant = product?.variants.find((item) => item.id === variantId);

      if (
        !product ||
        !product.isActive ||
        !variant ||
        !variant.isActive ||
        qty > variant.stock
      ) {
        return false;
      }

      setAllItems((previous) =>
        previous.map((item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          item.market === market
            ? { ...item, qty }
            : item,
        ),
      );

      return true;
    },
    [getProduct, market],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      setAllItems((previous) =>
        previous.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.variantId === variantId &&
              item.market === market
            ),
        ),
      );
    },
    [market],
  );

  const clearMarketCart = useCallback(() => {
    setAllItems((previous) =>
      previous.filter((item) => item.market !== market),
    );
  }, [market]);

  const clearAllCart = useCallback(() => {
    setAllItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.qty, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      allItems,
      itemCount,
      addItem,
      setItemQty,
      removeItem,
      clearMarketCart,
      clearAllCart,
    }),
    [
      items,
      allItems,
      itemCount,
      addItem,
      setItemQty,
      removeItem,
      clearMarketCart,
      clearAllCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
