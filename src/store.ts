// Unified store: products + cart + wishlist + auth + orders.
// - When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set, reads/writes
//   go through Supabase (products table, auth, orders/order_items, wishlists).
// - Without them, we fall back to the local demo catalog + localStorage so
//   every button still works for a preview.
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode, createElement,
} from 'react'
import { products as fallbackProducts, type Product } from './data'
import { supabase, hasSupabase } from './lib/supabase'
import {
  fetchProducts, subscribeProducts,
  authSignIn, authSignUp, authSignOut,
  createOrder, fetchMyOrders,
  fetchWishlist, addWish, removeWish,
  subscribeNewsletter,
} from './lib/db'

export type CartItem = { productId: string; qty: number }

export type Order = {
  id: string
  createdAt: number
  items: { productId: string; qty: number; price: number }[]
  total: number
  shipping: number
  customer: { name: string; phone: string; email?: string; city: string; address: string; postal?: string; note?: string }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export type User = { id?: string; email: string; name: string; phone?: string }
type Toast = { id: number; message: string; kind?: 'ok' | 'error' }

type StoreCtx = {
  // data
  products: Product[]
  loadingProducts: boolean
  cart: CartItem[]
  wishlist: string[]
  user: User | null
  orders: Order[]
  toasts: Toast[]
  supabaseReady: boolean

  // cart
  addToCart: (productId: string, qty?: number) => void
  removeFromCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clearCart: () => void

  // wishlist
  toggleWish: (productId: string) => void
  isWished: (productId: string) => boolean

  // derived
  cartCount: number
  cartSubtotal: number

  // auth
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>

  // orders / lookups
  placeOrder: (customer: Order['customer']) => Promise<Order>
  getProduct: (id: string) => Product | undefined
  subscribeToNewsletter: (email: string, lang: string) => Promise<void>
  toast: (message: string, kind?: 'ok' | 'error') => void
}

const Ctx = createContext<StoreCtx | null>(null)

// localStorage helpers
const read = <T,>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) as T : fallback
  } catch { return fallback }
}
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }

export function StoreProvider({ children }: { children: ReactNode }) {
  // --------- products (remote or fallback) ---------
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [loadingProducts, setLoadingProducts] = useState<boolean>(hasSupabase)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingProducts(true)
      try {
        const list = await fetchProducts()
        if (!cancelled) setProducts(list)
      } catch (e) {
        console.warn('[rosa] product fetch error, using fallback', e)
      } finally {
        if (!cancelled) setLoadingProducts(false)
      }
    }
    load()
    // Realtime: any change in `products` table triggers a refetch
    const unsub = subscribeProducts(load)
    return () => { cancelled = true; unsub() }
  }, [])

  // --------- cart (always local-persisted) ---------
  const [cart, setCart] = useState<CartItem[]>(() => read('rosa:cart', [] as CartItem[]))
  useEffect(() => write('rosa:cart', cart), [cart])

  // --------- wishlist (local + synced per user) ---------
  const [wishlist, setWishlist] = useState<string[]>(() => read('rosa:wish', [] as string[]))
  useEffect(() => write('rosa:wish', wishlist), [wishlist])

  // --------- auth ---------
  const [user, setUser] = useState<User | null>(() => read<User | null>('rosa:user', null))
  useEffect(() => write('rosa:user', user), [user])

  // Hydrate from Supabase session if present
  useEffect(() => {
    if (!hasSupabase || !supabase) return
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({
        id: u.id,
        email: u.email ?? '',
        name: (u.user_metadata?.full_name as string) || (u.email?.split('@')[0] ?? 'User'),
      })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session?.user) {
        const u = session.user
        setUser({
          id: u.id,
          email: u.email ?? '',
          name: (u.user_metadata?.full_name as string) || (u.email?.split('@')[0] ?? 'User'),
        })
      } else {
        setUser(null)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Pull remote wishlist on login
  useEffect(() => {
    if (!hasSupabase || !user?.id) return
    fetchWishlist().then(ids => { if (ids.length > 0) setWishlist(ids) })
  }, [user?.id])

  // --------- orders ---------
  const [orders, setOrders] = useState<Order[]>(() => read('rosa:orders', [] as Order[]))
  useEffect(() => write('rosa:orders', orders), [orders])
  useEffect(() => {
    if (!hasSupabase || !user?.id) return
    fetchMyOrders().then(remote => { if (remote.length > 0) setOrders(remote) })
  }, [user?.id])

  // --------- toasts ---------
  const [toasts, setToasts] = useState<Toast[]>([])
  const toast = useCallback((message: string, kind: 'ok' | 'error' = 'ok') => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, message, kind }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800)
  }, [])

  const getProduct = useCallback((id: string) => products.find(p => p.id === id), [products])

  // --------- cart ops ---------
  const addToCart = useCallback((productId: string, qty = 1) => {
    const p = products.find(x => x.id === productId)
    if (!p) return
    if (p.stock <= 0) { toast('Out of stock', 'error'); return }
    setCart(c => {
      const existing = c.find(i => i.productId === productId)
      const nextQty = Math.min(p.stock, (existing?.qty ?? 0) + qty)
      if (existing) return c.map(i => i.productId === productId ? { ...i, qty: nextQty } : i)
      return [...c, { productId, qty: nextQty }]
    })
    toast('added')
  }, [products, toast])

  const removeFromCart = useCallback((productId: string) => {
    setCart(c => c.filter(i => i.productId !== productId))
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    const p = products.find(x => x.id === productId)
    if (!p) return
    setCart(c => c.flatMap(i => {
      if (i.productId !== productId) return [i]
      const bounded = Math.max(0, Math.min(p.stock, qty))
      return bounded === 0 ? [] : [{ ...i, qty: bounded }]
    }))
  }, [products])

  const clearCart = useCallback(() => setCart([]), [])

  // --------- wishlist ops ---------
  const toggleWish = useCallback((productId: string) => {
    setWishlist(w => {
      const has = w.includes(productId)
      if (hasSupabase && user?.id) {
        if (has) removeWish(productId).catch(() => {}); else addWish(productId).catch(() => {})
      }
      return has ? w.filter(x => x !== productId) : [...w, productId]
    })
  }, [user?.id])
  const isWished = useCallback((productId: string) => wishlist.includes(productId), [wishlist])

  // --------- derived ---------
  const cartCount    = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart])
  const cartSubtotal = useMemo(() => cart.reduce((s, i) => {
    const p = products.find(x => x.id === i.productId); if (!p) return s
    const unit = p.discount ? Math.round(p.price * (100 - p.discount) / 100) : p.price
    return s + unit * i.qty
  }, 0), [cart, products])

  // --------- auth ops ---------
  const login = useCallback(async (email: string, password: string) => {
    if (hasSupabase) {
      try { await authSignIn(email, password); toast('Welcome back') }
      catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'login failed'
        toast(msg, 'error'); throw e
      }
    } else {
      setUser({ email, name: email.split('@')[0] })
      toast('Welcome back')
    }
  }, [toast])

  const register = useCallback(async (email: string, password: string, name: string) => {
    if (hasSupabase) {
      try { await authSignUp(email, password, name); toast('Account created') }
      catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'register failed'
        toast(msg, 'error'); throw e
      }
    } else {
      setUser({ email, name })
      toast('Account created')
    }
  }, [toast])

  const logout = useCallback(async () => {
    if (hasSupabase) await authSignOut()
    setUser(null)
    setOrders([])
    setWishlist([])
  }, [])

  // --------- orders ---------
  const placeOrder = useCallback(async (customer: Order['customer']): Promise<Order> => {
    const items = cart.map(i => {
      const p = products.find(x => x.id === i.productId)!
      const price = p.discount ? Math.round(p.price * (100 - p.discount) / 100) : p.price
      return { productId: i.productId, qty: i.qty, price }
    })
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal >= 500_000 ? 0 : 45_000
    const code = 'ROS-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const total = subtotal + shipping

    if (hasSupabase && user?.id) {
      try {
        await createOrder({ code, subtotal, shipping, total, customer, items })
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'order failed'
        toast(msg, 'error'); throw e
      }
    } else if (hasSupabase && !user?.id) {
      toast('Please sign in to place an order', 'error')
      throw new Error('auth_required')
    }

    const order: Order = { id: code, createdAt: Date.now(), items, total, shipping, customer, status: 'pending' }
    setOrders(o => [order, ...o])
    setCart([])
    return order
  }, [cart, products, user?.id, toast])

  const subscribeToNewsletter = useCallback(async (email: string, lang: string) => {
    try { await subscribeNewsletter(email, lang); toast('Subscribed') }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'subscribe failed'
      toast(msg, 'error'); throw e
    }
  }, [toast])

  const value: StoreCtx = {
    products, loadingProducts,
    cart, wishlist, user, orders, toasts,
    supabaseReady: hasSupabase,
    addToCart, removeFromCart, setQty, clearCart,
    toggleWish, isWished,
    cartCount, cartSubtotal,
    login, register, logout,
    placeOrder, getProduct,
    subscribeToNewsletter, toast,
  }

  return createElement(Ctx.Provider, { value }, children)
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used inside StoreProvider')
  return v
}
