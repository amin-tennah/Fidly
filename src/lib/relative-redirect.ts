import { NextResponse } from "next/server";

/**
 * Redirect with a relative `Location`: the browser resolves it against the address it
 * is actually on. An absolute URL built from the request would point to the origin the
 * server sees (`localhost:3000` behind a tunnel or a reverse proxy), not the public one.
 * `path` must be an internal path (already sanitised by the caller).
 */
export function relativeRedirect(path: string): NextResponse {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
}
