import type { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/** Next.js 16 Proxy (formerly Middleware): Supabase session refresh + optimistic route guard. */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals, metadata files and static assets.
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|woff2?)$).*)",
  ],
};
