import { supabase, hasSupabase } from './supabase'
import type {
  CatalogProduct,
  Lang,
  MarketSettings,
  ProductImage,
  ProductVariant,
} from '../types/catalog'

type TranslationRow = {
  lang: Lang
  title: string
  description: string | null
  features: unknown
}

type VariantRow = {
  id: string
  sku: string
  option_values: Record<string, string> | null
  price_irr: number
  price_usd_cents: number | null
  discount_percent: number | null
  stock: number
  is_active: boolean
  sort_order: number
}

type ImageRow = {
  id: string
  image_url: string
  alt_text: Record<string, string> | null
  is_primary: boolean
  sort_order: number
}

type ProductRow = {
  id: string
  slug: string
  brand_id: string
  category: CatalogProduct['category']
  badge: CatalogProduct['badge'] | null
  rating: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  brands: { name: string } | null
  product_translations: TranslationRow[]
  product_variants: VariantRow[]
  product_images: ImageRow[]
}

const languages: Lang[] = ['fa', 'en', 'ar']

function localizedAlt(value: Record<string, string> | null) {
  return {
    fa: value?.fa ?? '',
    en: value?.en ?? '',
    ar: value?.ar ?? '',
  }
}

function mapVariant(row: VariantRow): ProductVariant {
  const prices: ProductVariant['prices'] = [
    { market: 'iran', currency: 'IRR', amount: Number(row.price_irr) },
  ]

  // Every active variant must have an international price. When an
  // explicit USD price is not stored, derive it from the canonical IRR price.
  // Exchange rate confirmed for ROSA: 1 USD = 2,500,000 IRR.
  const usdAmount =
    row.price_usd_cents !== null
      ? Number(row.price_usd_cents) / 100
      : Number(row.price_irr) / 2_500_000

  prices.push({
    market: 'international',
    currency: 'USD',
    amount: Math.round(usdAmount * 100) / 100,
  })

  return {
    id: row.id,
    sku: row.sku,
    optionValues: row.option_values ?? {},
    prices,
    discountPercent: Number(row.discount_percent ?? 0),
    stock: Number(row.stock ?? 0),
    isActive: row.is_active,
    sortOrder: row.sort_order ?? 0,
  }
}

function mapImage(row: ImageRow): ProductImage {
  return {
    id: row.id,
    url: row.image_url,
    alt: localizedAlt(row.alt_text),
    isPrimary: row.is_primary,
    sortOrder: row.sort_order ?? 0,
  }
}

function mapProduct(row: ProductRow): CatalogProduct {
  const translations = Object.fromEntries(
    languages.map(lang => {
      const translation = row.product_translations.find(
        item => item.lang === lang,
      )

      return [
        lang,
        {
          title: translation?.title ?? '',
          description: translation?.description ?? '',
          features: Array.isArray(translation?.features)
            ? translation.features.map(String)
            : [],
        },
      ]
    }),
  ) as CatalogProduct['translations']

  return {
    id: row.id,
    slug: row.slug,
    brandId: row.brand_id,
    brandName: row.brands?.name ?? '',
    category: row.category,
    badge: row.badge ?? undefined,
    rating: Number(row.rating ?? 0),
    isActive: row.is_active,
    translations,
    variants: (row.product_variants ?? [])
      .filter(variant => variant.is_active)
      .map(mapVariant)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    images: (row.product_images ?? [])
      .map(mapImage)
      .sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1
        return a.sortOrder - b.sortOrder
      }),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
  if (!hasSupabase || !supabase) {
    throw new Error('supabase_not_configured')
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      brand_id,
      category,
      badge,
      rating,
      is_active,
      created_at,
      updated_at,
      brands(name),
      product_translations(lang, title, description, features),
      product_variants(
        id,
        sku,
        option_values,
        price_irr,
        price_usd_cents,
        discount_percent,
        stock,
        is_active,
        sort_order
      ),
      product_images(
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`catalog_fetch_failed: ${error.message}`)
  }

  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct)
}

export async function fetchMarketSettings(): Promise<MarketSettings[]> {
  if (!hasSupabase || !supabase) {
    throw new Error('supabase_not_configured')
  }

  const { data, error } = await supabase
    .from('market_settings')
    .select('market, currency, shipping_fee, free_shipping_threshold, is_enabled')
    .eq('is_enabled', true)

  if (error) {
    throw new Error(`market_settings_fetch_failed: ${error.message}`)
  }

  return (data ?? []).map(row => ({
    market: row.market,
    currency: row.currency,
    shippingFee: Number(row.shipping_fee),
    freeShippingThreshold:
      row.free_shipping_threshold === null
        ? null
        : Number(row.free_shipping_threshold),
    isEnabled: row.is_enabled,
  })) as MarketSettings[]
}

export function subscribeCatalog(onChange: () => void): () => void {
  if (!hasSupabase || !supabase) return () => {}

  const tables = [
    'products',
    'brands',
    'product_translations',
    'product_variants',
    'product_images',
  ]

  const channel = supabase.channel('rosa-v2-catalog')

  for (const table of tables) {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      onChange,
    )
  }

  channel.subscribe()

  return () => {
    void supabase?.removeChannel(channel)
  }
}
