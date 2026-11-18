-- ROSA 2 public website feedback inbox
create table if not exists public.site_feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  email text not null check (char_length(trim(email)) between 3 and 254),
  message text not null check (char_length(trim(message)) between 5 and 3000),
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

create index if not exists site_feedback_status_created_idx
  on public.site_feedback(status, created_at desc);

alter table public.site_feedback enable row level security;

drop policy if exists "public_can_submit_site_feedback" on public.site_feedback;
create policy "public_can_submit_site_feedback"
  on public.site_feedback for insert
  to anon, authenticated
  with check (
    status = 'new'
    and char_length(trim(name)) between 1 and 100
    and char_length(trim(email)) between 3 and 254
    and char_length(trim(message)) between 5 and 3000
  );

drop policy if exists "admins_can_read_site_feedback" on public.site_feedback;
create policy "admins_can_read_site_feedback"
  on public.site_feedback for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "admins_can_update_site_feedback" on public.site_feedback;
create policy "admins_can_update_site_feedback"
  on public.site_feedback for update
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
    and status in ('new', 'read')
  );

-- No public SELECT, UPDATE, or DELETE policy is granted.
