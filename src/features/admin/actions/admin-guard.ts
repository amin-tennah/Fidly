import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isUserPlatformAdmin } from "@/features/auth/queries/get-session-context";
import { type ActionResult, err, ok } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export interface AdminContext {
  readonly supabase: SupabaseClient<Database>;
  readonly userId: string;
}

/**
 * Steps (1) and (2) of every back-office action: authenticated user, then a row in
 * `platform_admins`. The client stays the user's own: the admin RLS policies apply, no
 * service role is involved.
 */
export async function authorizePlatformAdmin(): Promise<ActionResult<AdminContext>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return err("UNAUTHORIZED");
  }
  if (!(await isUserPlatformAdmin(data.user.id))) {
    return err("FORBIDDEN");
  }
  return ok({ supabase, userId: data.user.id });
}
