/*
 * Rézone service worker (ADR-025). Hand-written, no dependency.
 *
 * It caches exactly two things:
 *   1. /offline.html, the standalone page that redisplays the personal QR;
 *   2. the content-hashed build files under /_next/static/.
 * Everything else (pages, RSC payloads, Server Actions, Supabase, images) goes to the network
 * untouched: this worker never answers for it, so it can never serve stale or personal data.
 *
 * The build id arrives as `?v=<id>` on the script URL (see ServiceWorkerRegistrar). A new build
 * means a new URL, hence a new worker and a new cache; the old caches are purged on activation.
 */
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE_PREFIX = "rezone-";
const CACHE_NAME = CACHE_PREFIX + VERSION;
const OFFLINE_URL = "/offline.html";
const STATIC_PREFIX = "/_next/static/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // `reload` bypasses the HTTP cache: the page must belong to this very build.
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/** Hashed files never change: the cache is always right, the network is only a fallback. */
async function serveStatic(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
}

/** Network first; the offline page answers only when the network itself fails. */
async function serveNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(OFFLINE_URL)) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(serveNavigation(request));
  } else if (url.pathname.startsWith(STATIC_PREFIX)) {
    event.respondWith(serveStatic(request));
  }
});
