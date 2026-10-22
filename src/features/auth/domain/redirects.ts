import {
  CLIENT_HOME_PATH,
  LOGIN_PATH,
  NEXT_PARAM,
  PUBLIC_PATH_PREFIXES,
} from "@/features/auth/constants";

const SAFE_ORIGIN = "http://fidly.internal";

/**
 * Returns a same-origin relative path, or the client home when `raw` is
 * missing or could redirect off-site (open-redirect protection).
 */
export function sanitizeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return CLIENT_HOME_PATH;
  }

  try {
    const url = new URL(raw, SAFE_ORIGIN);
    if (url.origin !== SAFE_ORIGIN) {
      return CLIENT_HOME_PATH;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return CLIENT_HOME_PATH;
  }
}

/** Builds `/login?next=<path>` while keeping the destination safe. */
export function buildLoginPath(nextPath: string): string {
  const safeNext = sanitizeNextPath(nextPath);
  if (safeNext === CLIENT_HOME_PATH) {
    return LOGIN_PATH;
  }
  return `${LOGIN_PATH}?${NEXT_PARAM}=${encodeURIComponent(safeNext)}`;
}

/** Appends a safe `next` parameter to an internal path. */
export function withNextParam(path: string, nextPath: string): string {
  const safeNext = sanitizeNextPath(nextPath);
  if (safeNext === CLIENT_HOME_PATH) {
    return path;
  }
  return `${path}?${NEXT_PARAM}=${encodeURIComponent(safeNext)}`;
}

/** True when the route can be visited without a session. */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`),
  );
}
