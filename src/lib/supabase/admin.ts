import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";
import { getServerEnv } from "@/lib/server-env";
import type { Database } from "@/types/database.types";

/**
 * Service-role Supabase client: BYPASSES RLS.
 * Reserved for explicit administration tasks (back-office, E2E fixtures).
 * FORBIDDEN in the standard user flow (cf. .cursorrules §6).
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> {
  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

  return createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

