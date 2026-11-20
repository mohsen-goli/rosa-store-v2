-- Restrict direct API execution of privileged SECURITY DEFINER functions.
-- Keep the admin RPC and is_admin helper available to signed-in users:
-- the RPC performs its own admin check, and RLS policies use is_admin().
revoke execute on function public.admin_update_order_status(uuid, text)
  from public, anon;
grant execute on function public.admin_update_order_status(uuid, text)
  to authenticated;

-- This function is only invoked by the auth.users AFTER INSERT trigger.
-- It must not be callable directly through the Data API.
revoke execute on function public.handle_new_user()
  from public, anon, authenticated;

-- RLS policies and the guarded admin RPC require this helper for signed-in
-- sessions, but anonymous callers should not be able to probe it.
revoke execute on function public.is_admin()
  from public, anon;
grant execute on function public.is_admin()
  to authenticated;
