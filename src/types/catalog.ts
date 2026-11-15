export type Lang = "fa" | "en" | "ar";

export type Market = "iran" | "international";

export type Currency = "IRR" | "USD";

export type Category = "skincare" | "makeup" | "perfume" | "haircare";

export type ProductBadge = "luxury" | "new" | "bestseller";

export type LocalizedText = Record<Lang, string>;

export type ProductTranslation = {
  title: string;
  description: string;
  features: string[];
};

export type MarketPrice = {
  market: Market;
  currency: Currency;
  amount: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  optionValues: Record<string, string>;
  prices: MarketPrice[];
  discountPercent: number;
  stock: number;
  isActive: boolean;
  sortOrder: number;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: LocalizedText;
  isPrimary: boolean;
  sortOrder: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  brandId: string;
  brandName: string;
  category: Category;
  badge?: ProductBadge;
  rating: number;
  isActive: boolean;
  translations: Record<Lang, ProductTranslation>;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type MarketSettings = {
  market: Market;
  currency: Currency;
  shippingFee: number;
  freeShippingThreshold: number | null;
  isEnabled: boolean;
};

export type CartItem = {
  productId: string;
  variantId: string;
  market: Market;
  qty: number;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  postal?: string;
  note?: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
