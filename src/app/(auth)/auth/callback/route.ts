import { type NextRequest, type NextResponse } from "next/server";
import {
  LOGIN_ERROR_PARAM,
  LOGIN_PATH,
  NEXT_PARAM,
  sanitizeNextPath,
} from "@/features/auth";
import { relativeRedirect } from "@/lib/relative-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth PKCE callback route handler (Google Sign-In, Step 3.2).
 * Exchanges the temporary `code` for a Supabase session and redirects to `next`.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const nextPath = sanitizeNextPath(searchParams.get(NEXT_PARAM));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return relativeRedirect(nextPath);
    }
  }

  const loginParams = new URLSearchParams({
    [LOGIN_ERROR_PARAM]: "oauth_callback_failed",
  });
  if (nextPath !== "/") {
    loginParams.set(NEXT_PARAM, nextPath);
  }
  return relativeRedirect(`${LOGIN_PATH}?${loginParams.toString()}`);
}
