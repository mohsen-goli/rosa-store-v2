// Thin data-access layer. Every function returns the shape the UI already
// expects, so swapping the backing store (Supabase ⇄ local demo) is invisible
// to components.
import { supabase, hasSupabase } from './supabase'
import { products as fallbackProducts, type Product, type Category } from '../data'
import type { Order } from '../store'

type LegacyCatalogRow = {
  id: string
  category: Category
  badge: Product['badge'] | null
  rating: number | null
  created_at: string
  brands: { name: string } | null
  product_translations: { lang: 'fa' | 'en' | 'ar'; title: string }[]
  product_variants: {
    price_irr: number
    discount_percent: number | null
    stock: number
    is_active: boolean
    sort_order: number
  }[]
  product_images: {
    image_url: string
    is_primary: boolean
    sort_order: number
  }[]
}

function mapLegacyCatalogRow(row: LegacyCatalogRow): Product {
  const variant = [...(row.product_variants ?? [])]
    .filter(item => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)[0]
  const translations = Object.fromEntries(
    (['fa', 'en', 'ar'] as const).map(lang => [
      lang,
      row.product_translations.find(item => item.lang === lang)?.title ?? '',
    ]),
  ) as Product['title']
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1
      return a.sort_order - b.sort_order
    })
    .map(image => image.image_url)

  return {
    id: row.id,
    title: translations,
    brand: row.brands?.name ?? '',
    category: row.category,
    price: Number(variant?.price_irr ?? 0),
    discount: Number(variant?.discount_percent ?? 0) || undefined,
    rating: Number(row.rating ?? 0),
    stock: Number(variant?.stock ?? 0),
    images: images.length
      ? images
      : ['https://images.unsplash.com/photo-1522335789203-aaa0bdf829ab?auto=format&fit=crop&w=800&q=70'],
    badge: row.badge ?? undefined,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  if (!hasSupabase || !supabase) return fallbackProducts

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      category,
      badge,
      rating,
      created_at,
      brands(name),
      product_translations(lang, title),
      product_variants(price_irr, discount_percent, stock, is_active, sort_order),
      product_images(image_url, is_primary, sort_order)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[rosa] products fetch failed, using fallback:', error.message)
    return fallbackProducts
  }
  if (!data || data.length === 0) return fallbackProducts
  return (data as unknown as LegacyCatalogRow[]).map(mapLegacyCatalogRow)
}

// Realtime: call the given callback whenever any product row changes.
export function subscribeProducts(onChange: () => void): () => void {
  if (!hasSupabase || !supabase) return () => {}
  const channel = supabase
    .channel('public:products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, onChange)
    .subscribe()
  return () => { supabase?.removeChannel(channel) }
}

// -------------------- AUTH --------------------
export async function authSignUp(email: string, password: string, fullName?: string) {
  if (!hasSupabase || !supabase) throw new Error('supabase_not_configured')
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName ?? '' } },
  })
  if (error) throw error
  return data
}

export async function authSignIn(email: string, password: string) {
  if (!hasSupabase || !supabase) throw new Error('supabase_not_configured')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function authSignOut() {
  if (!hasSupabase || !supabase) return
  await supabase.auth.signOut()
}

// -------------------- ORDERS --------------------
export type DbOrderInput = {
  code?: string
  subtotal?: number
  shipping?: number
  total?: number
  customer: Order['customer'] & { market?: 'iran' | 'international'; currency?: 'IRR' | 'USD' }
  items: {
    productId?: string
    variantId?: string
    qty: number
    price?: number
    productSnapshot?: Record<string, unknown>
  }[]
}

/**
 * Order prices, discounts, shipping and snapshots are calculated by the
 * database function. Values supplied by the browser are intentionally ignored.
 */
export async function createOrder(input: DbOrderInput): Promise<string> {
  if (!hasSupabase || !supabase) throw new Error('supabase_not_configured')

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('auth_required')

  const items = input.items.map((item) => {
    if (!item.variantId) {
      throw new Error('A valid product variant is required to place this order')
    }
    if (!Number.isInteger(item.qty) || item.qty < 1) {
      throw new Error('Invalid product quantity')
    }
    return { variantId: item.variantId, qty: item.qty }
  })

  const { data, error } = await supabase.rpc('create_order_secure', {
    p_market: input.customer.market ?? 'iran',
    p_customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email ?? null,
      city: input.customer.city,
      address: input.customer.address,
      postal: input.customer.postal ?? null,
      note: input.customer.note ?? null,
    },
    p_items: items,
  })

  if (error) {
    throw new Error(`Secure order creation failed: ${error.message}`)
  }
  if (typeof data !== 'string' || !data) {
    throw new Error('The order service returned an invalid confirmation')
  }
  return data
}

export async function fetchMyOrders(): Promise<Order[]> {
  if (!hasSupabase || !supabase) return []
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('orders')
    .select('id, code, status, subtotal, shipping, total, customer, created_at, order_items(product_id, quantity, unit_price)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  type Row = {
    id: string; code: string; status: Order['status']
    subtotal: number; shipping: number; total: number
    customer: Order['customer'] & { currency?: 'IRR' | 'USD'; market?: 'iran' | 'international' }; created_at: string
    order_items: { product_id: string; quantity: number; unit_price: number }[]
  }
  return (data as Row[]).map((r): Order => ({
    id: r.code,
    createdAt: new Date(r.created_at).getTime(),
    items: r.order_items.map(i => ({ productId: i.product_id, qty: i.quantity, price: r.customer?.currency === 'USD' ? i.unit_price / 100 : i.unit_price })),
    total: r.customer?.currency === 'USD' ? r.total / 100 : r.total,
    shipping: r.customer?.currency === 'USD' ? r.shipping / 100 : r.shipping,
    customer: r.customer,
    status: r.status,
  }))
}

// -------------------- WISHLIST --------------------
export async function fetchWishlist(): Promise<string[]> {
  if (!hasSupabase || !supabase) return []
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase.from('wishlists').select('product_id').eq('user_id', user.id)
  if (error || !data) return []
  return data.map(r => r.product_id as string)
}

export async function addWish(productId: string) {
  if (!hasSupabase || !supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('wishlists').upsert({ user_id: user.id, product_id: productId })
}

export async function removeWish(productId: string) {
  if (!hasSupabase || !supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('wishlists').delete().match({ user_id: user.id, product_id: productId })
}

// -------------------- NEWSLETTER --------------------
export async function subscribeNewsletter(email: string, lang: string) {
  if (!hasSupabase || !supabase) return { ok: true, local: true }
  const normalizedEmail = email.trim().toLowerCase()
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(normalizedEmail)) throw new Error('invalid_email')
  if (!['fa', 'en', 'ar'].includes(lang)) throw new Error('invalid_language')
  const { error } = await supabase.from('newsletter_subscribers').insert({ email: normalizedEmail, lang })
  if (error && error.code !== '23505') throw error
  return { ok: true }
}
