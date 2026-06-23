import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client — SERVER-ONLY.
// De service_role key bypasst RLS, dus hij mag NOOIT in de browser-bundle komen.
// Daarom: geen NEXT_PUBLIC_ prefix. Alleen importeren in server actions / route
// handlers, nooit in een "use client" component.
//
// Zet in Vercel (en lokaal in .env.local):
//   SUPABASE_SERVICE_ROLE_KEY=<service_role key uit Supabase project settings>
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — vereist voor bewerk-acties.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
