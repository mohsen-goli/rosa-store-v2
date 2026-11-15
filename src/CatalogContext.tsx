import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CatalogProduct, Market, MarketSettings } from "./types/catalog";

import {
  fetchCatalogProducts,
  fetchMarketSettings,
  subscribeCatalog,
} from "./lib/catalog-db";

type CatalogContextValue = {
  products: CatalogProduct[];
  marketSettings: MarketSettings[];
  market: Market;
  setMarket: (market: Market) => void;
  currentMarketSettings: MarketSettings | undefined;
  loading: boolean;
  error: string | null;
  refreshCatalog: () => Promise<void>;
  getProduct: (id: string) => CatalogProduct | undefined;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [marketSettings, setMarketSettings] = useState<MarketSettings[]>([]);
  const [market, setMarket] = useState<Market>("iran");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCatalog = useCallback(async () => {
    try {
      setError(null);

      const [catalogData, marketData] = await Promise.all([
        fetchCatalogProducts(),
        fetchMarketSettings(),
      ]);

      setProducts(catalogData);
      setMarketSettings(marketData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "catalog_load_failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();

    const unsubscribe = subscribeCatalog(() => {
      void refreshCatalog();
    });

    return unsubscribe;
  }, [refreshCatalog]);

  const currentMarketSettings = marketSettings.find(
    (item) => item.market === market,
  );

  const getProduct = useCallback(
    (id: string) => products.find((product) => product.id === id),
    [products],
  );

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      marketSettings,
      market,
      setMarket,
      currentMarketSettings,
      loading,
      error,
      refreshCatalog,
      getProduct,
    }),
    [
      products,
      marketSettings,
      market,
      currentMarketSettings,
      loading,
      error,
      refreshCatalog,
      getProduct,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog must be used inside CatalogProvider");
  }

  return context;
}
