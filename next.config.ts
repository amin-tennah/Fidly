import type { NextConfig } from "next";

/** Only the project's public Storage path may be optimised by `next/image` (restaurant media). */
function supabaseImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!rawUrl) {
    return [];
  }
  const { protocol, hostname } = new URL(rawUrl);
  return [
    {
      protocol: protocol === "http:" ? "http" : "https",
      hostname,
      pathname: "/storage/v1/object/public/restaurant-media/**",
    },
  ];
}

/**
 * One id per build: it names the build (`.next/BUILD_ID`) and, through `NEXT_PUBLIC_BUILD_ID`,
 * the service worker cache, so a deployment never reads a previous build's cache (ADR-025).
 */
const BUILD_ID = process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString(36);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  generateBuildId: () => Promise.resolve(BUILD_ID),
  env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID },
  poweredByHeader: false,
  // Dev only: lets a phone load `/_next/*` (hydration, HMR) through a Cloudflare quick
  // tunnel (`pnpm tunnel`) or the machine's LAN address.
  allowedDevOrigins: ["*.trycloudflare.com", "192.168.1.154"],
  images: {
    remotePatterns: supabaseImagePatterns(),
  },
  headers() {
    return Promise.resolve([
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), geolocation=(self), microphone=()",
          },
        ],
      },
      {
        // The browser must always re-check the worker, or a stale one could outlive a deployment.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "text/javascript; charset=utf-8" },
        ],
      },
    ]);
  },
};

export default nextConfig;
