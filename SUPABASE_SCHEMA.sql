-- =====================================================================
--  ROSA BEAUTY — Supabase schema (storefront + admin-compatible)
--  Run this in the Supabase SQL editor on a fresh project, then paste
--  VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY into your .env.local.
-- =====================================================================

-- Extensions ----------------------------------------------------------
create extension if not exists "pgcrypto";

-- =====================================================================
--  PRODUCTS
-- =====================================================================
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique,
  title_fa     text not null,
  title_en     text not null,
  title_ar     text not null,
  brand        text not null,
  category     text not null check (category in ('skincare','makeup','perfume','haircare')),
  price        bigint not null,              -- stored in smallest currency unit (toman)
  discount     int default 0,                -- percentage 0..100
  rating       numeric(3,1) default 4.5,
  stock        int not null default 0,
  images       text[] not null default '{}', -- public image URLs
  badge        text,                         -- 'luxury' | 'new' | 'bestseller' | null
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists products_active_idx   on public.products(active);
create index if not exists products_category_idx on public.products(category);

-- =====================================================================
--  PROFILES  (1-to-1 with auth.users)
-- =====================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  phone       text,
  city        text,
  address     text,
  postal_code text,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
--  ORDERS + ORDER ITEMS
-- =====================================================================
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users on delete set null,
  code         text unique not null,         -- human-readable "ROS-ABC123"
  status       text not null default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  subtotal     bigint not null,
  shipping     bigint not null default 0,
  total        bigint not null,
  customer     jsonb not null,               -- { name, phone, email, city, address, postal, note }
  created_at   timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  qty        int not null check (qty > 0),
  price      bigint not null                  -- unit price at purchase time (after discount)
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- =====================================================================
--  WISHLIST
-- =====================================================================
create table if not exists public.wishlists (
  user_id    uuid not null references auth.users on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- =====================================================================
--  NEWSLETTER
-- =====================================================================
create table if not exists public.newsletter_subscribers (
  email      text primary key,
  lang       text,
  created_at timestamptz not null default now()
);

-- =====================================================================
--  ROW LEVEL SECURITY
-- =====================================================================
alter table public.products               enable row level security;
alter table public.profiles               enable row level security;
alter table public.orders                 enable row level security;
alter table public.order_items            enable row level security;
alter table public.wishlists              enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- products: anyone can read active products; admins manage via dashboard (service_role bypasses RLS)
drop policy if exists "products_read_active" on public.products;
create policy "products_read_active" on public.products
  for select using (active = true);

-- profiles: a user can read/write only their own row
drop policy if exists "profile_owner_read"  on public.profiles;
drop policy if exists "profile_owner_write" on public.profiles;
create policy "profile_owner_read"  on public.profiles for select using (auth.uid() = id);
create policy "profile_owner_write" on public.profiles for all    using (auth.uid() = id) with check (auth.uid() = id);

-- orders: a user can read & create only their own orders
drop policy if exists "orders_owner_read"   on public.orders;
drop policy if exists "orders_owner_insert" on public.orders;
create policy "orders_owner_read"   on public.orders for select using (auth.uid() = user_id);
create policy "orders_owner_insert" on public.orders for insert with check (auth.uid() = user_id);

-- order_items: visible/insertable only through the owning order
drop policy if exists "order_items_owner_read"   on public.order_items;
drop policy if exists "order_items_owner_insert" on public.order_items;
create policy "order_items_owner_read" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "order_items_owner_insert" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- wishlists: owner-only
drop policy if exists "wishlists_owner_all" on public.wishlists;
create policy "wishlists_owner_all" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- newsletter: anyone can insert an email (public form)
drop policy if exists "newsletter_insert_any" on public.newsletter_subscribers;
create policy "newsletter_insert_any" on public.newsletter_subscribers
  for insert with check (true);

-- =====================================================================
--  Optional storage bucket for product images
-- =====================================================================
-- insert into storage.buckets (id, name, public) values ('products','products', true)
--   on conflict (id) do nothing;
