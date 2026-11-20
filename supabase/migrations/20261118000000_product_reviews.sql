-- ROSA 2 product reviews
-- products.id is TEXT in the live ROSA 2 database.
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  rating smallint not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists product_reviews_product_status_created_idx
  on public.product_reviews(product_id, status, created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "approved_reviews_or_own_read" on public.product_reviews;
create policy "approved_reviews_or_own_read"
  on public.product_reviews for select
  using (status = 'approved' or auth.uid() = user_id);

drop policy if exists "authenticated_users_create_pending_reviews" on public.product_reviews;
create policy "authenticated_users_create_pending_reviews"
  on public.product_reviews for insert to authenticated
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and rating between 1 and 5
    and length(trim(display_name)) > 0
    and length(trim(title)) > 0
    and length(trim(body)) between 10 and 2000
  );

-- Admins can review every submission and moderate its status.
drop policy if exists "admins_can_read_product_reviews" on public.product_reviews;
create policy "admins_can_read_product_reviews"
  on public.product_reviews for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "admins_can_moderate_product_reviews" on public.product_reviews;
create policy "admins_can_moderate_product_reviews"
  on public.product_reviews for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
    and status in ('pending', 'approved', 'rejected')
  );

-- No public update/delete policy: customers cannot approve or edit reviews.
