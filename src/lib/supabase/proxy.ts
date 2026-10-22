import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_PATH, NEXT_PARAM } from "@/features/auth/constants";
import { buildLoginPath, isPublicPath, sanitizeNextPath } from "@/features/auth/domain/redirects";
import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Refreshes the Supabase session on every request and performs OPTIMISTIC
 * redirects only (session present or not). Role checks (restaurant member,
 * platform admin) are enforced in server layouts/queries and by RLS.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const env = getPublicEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Must run right after client creation: validates the JWT and refreshes tokens.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims.sub);
  const { pathname, search } = request.nextUrl;

  if (!isAuthenticated && !isPublicPath(pathname)) {
    return redirectKeepingCookies(request, response, buildLoginPath(`${pathname}${search}`));
  }

  if (isAuthenticated && pathname === LOGIN_PATH) {
    const next = sanitizeNextPath(request.nextUrl.searchParams.get(NEXT_PARAM));
    return redirectKeepingCookies(request, response, next);
  }

  return response;
}

function redirectKeepingCookies(
  request: NextRequest,
  source: NextResponse,
  path: string,
): NextResponse {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
