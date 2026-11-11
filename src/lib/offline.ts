/** Build id inlined by `next.config.ts` (same value as `.next/BUILD_ID`). */
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";

/** Script URL carrying the build id: a new build is a new URL, hence a new worker and cache. */
export const SERVICE_WORKER_URL = `/sw.js?v=${encodeURIComponent(BUILD_ID)}`;
