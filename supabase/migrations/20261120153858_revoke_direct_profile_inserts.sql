-- Profiles are created by the trusted auth trigger; browser clients cannot create roles.
revoke insert on table public.profiles from anon, authenticated;
