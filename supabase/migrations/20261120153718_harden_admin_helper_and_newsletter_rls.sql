-- Tighten the exposed admin helper and restore safe newsletter signup.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_admin()
returns boolean language sql stable security invoker set search_path = ''
as $function$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$function$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;

drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders" on public.orders
for select to authenticated using (private.is_admin());

drop policy if exists "Admins can read all order items" on public.order_items;
create policy "Admins can read all order items" on public.order_items
for select to authenticated using (private.is_admin());

create or replace function public.admin_update_order_status(p_order_id uuid, p_status text)
returns void language plpgsql security definer set search_path = ''
as $function$
begin
  if not private.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'processing', 'shipped', 'delivered', 'cancelled') then
    raise exception 'Invalid order status';
  end if;
  update public.orders set status = p_status where id = p_order_id;
  if not found then raise exception 'Order not found'; end if;
end;
$function$;

revoke all on function public.admin_update_order_status(uuid, text) from public, anon;
grant execute on function public.admin_update_order_status(uuid, text) to authenticated;
drop function if exists public.is_admin();

create unique index if not exists newsletter_subscribers_email_lower_uidx
on public.newsletter_subscribers (lower(email));
grant insert on table public.newsletter_subscribers to anon, authenticated;

drop policy if exists "Public can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter" on public.newsletter_subscribers
for insert to anon, authenticated
with check (
  email = btrim(email)
  and char_length(email) between 3 and 254
  and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  and lang in ('fa', 'en', 'ar')
  and (market is null or market in ('iran', 'international'))
);
