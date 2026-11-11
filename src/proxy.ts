import type { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/** Next.js 16 Proxy (formerly Middleware): Supabase session refresh + optimistic route guard. */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals, metadata files, static assets and the service worker files
    // (fetched by the browser before any sign-in, and while offline).
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|sw\\.js|offline\\.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff2?)$).*)",
  ],
};
