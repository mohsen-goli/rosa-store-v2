-- Clients must create orders only through create_order_secure().
-- This prevents browser-supplied totals, prices, ownership and order snapshots.
revoke insert on table public.orders from anon, authenticated;
revoke insert on table public.order_items from anon, authenticated;
