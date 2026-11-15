// Thin data-access layer. Every function returns the shape the UI already
// expects, so swapping the backing store (Supabase ⇄ local demo) is invisible
// to components.
import { supabase, hasSupabase } from './supabase'
import { products as fallbackProducts, type Product, type Category } from '../data'
import type { Order } from '../store'

type DbProductRow = {
  id: string
  title_fa: string; title_en: string; title_ar: string
  brand: string; category: Category
  price: number; discount: number | null; rating: number | null
  stock: number; images: string[] | null
  badge: Product['badge'] | null
  active: boolean
  created_at: string
}

function mapRow(r: DbProductRow): Product {
  return {
    id: r.id,
    title: { fa: r.title_fa, en: r.title_en, ar: r.title_ar },
    brand: r.brand,
    category: r.category,
    price: r.price,
    discount: r.discount ?? undefined,
    rating: Number(r.rating ?? 4.5),
    stock: r.stock,
    images: (r.images && r.images.length > 0) ? r.images : ['https://images.unsplash.com/photo-1522335789203-aaa0bdf829ab?auto=format&fit=crop&w=800&q=70'],
    badge: r.badge ?? undefined,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  if (!hasSupabase || !supabase) return fallbackProducts
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) { console.warn('[rosa] products fetch failed, using fallback:', error.message); return fallbackProducts }
  if (!data || data.length === 0) return fallbackProducts
  return data.map(mapRow as (r: unknown) => Product)
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
  code: string
  subtotal: number
  shipping: number
  total: number
  customer: Order['customer']
  items: { productId: string; qty: number; price: number }[]
}

export async function createOrder(input: DbOrderInput): Promise<string> {
  if (!hasSupabase || !supabase) throw new Error('supabase_not_configured')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('auth_required')

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id:  user.id,
      code:     input.code,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total:    input.total,
      customer: input.customer,
      status:   'pending',
    })
    .select('id')
    .single()
  if (orderErr || !order) throw orderErr ?? new Error('order_insert_failed')

  const { error: itemsErr } = await supabase.from('order_items').insert(
    input.items.map(i => ({
      order_id:   order.id,
      product_id: i.productId,
      qty:        i.qty,
      price:      i.price,
    }))
  )
  if (itemsErr) throw itemsErr

  return order.id
}

export async function fetchMyOrders(): Promise<Order[]> {
  if (!hasSupabase || !supabase) return []
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('orders')
    .select('id, code, status, subtotal, shipping, total, customer, created_at, order_items(product_id, qty, price)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  type Row = {
    id: string; code: string; status: Order['status']
    subtotal: number; shipping: number; total: number
    customer: Order['customer']; created_at: string
    order_items: { product_id: string; qty: number; price: number }[]
  }
  return (data as Row[]).map((r): Order => ({
    id: r.code,
    createdAt: new Date(r.created_at).getTime(),
    items: r.order_items.map(i => ({ productId: i.product_id, qty: i.qty, price: i.price })),
    total: r.total,
    shipping: r.shipping,
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
  const { error } = await supabase.from('newsletter_subscribers').upsert({ email, lang })
  if (error) throw error
  return { ok: true }
}
