import { NextResponse, type NextRequest } from "next/server";
import {
  LOGIN_ERROR_PARAM,
  LOGIN_PATH,
  NEXT_PARAM,
  sanitizeNextPath,
} from "@/features/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth PKCE callback route handler (Google Sign-In, Step 3.2).
 * Exchanges the temporary `code` for a Supabase session and redirects to `next`.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const nextPath = sanitizeNextPath(searchParams.get(NEXT_PARAM));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(nextPath, origin));
    }
  }

  const loginUrl = new URL(LOGIN_PATH, origin);
  loginUrl.searchParams.set(LOGIN_ERROR_PARAM, "oauth_callback_failed");
  if (nextPath !== "/") {
    loginUrl.searchParams.set(NEXT_PARAM, nextPath);
  }
  return NextResponse.redirect(loginUrl);
}
