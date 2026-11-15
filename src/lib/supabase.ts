import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabase: boolean = Boolean(url && anon);

export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(url as string, anon as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "rosa.supabase.auth",
      },
    })
  : null;
