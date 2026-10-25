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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Dev only: lets a phone on the local network load `/_next/*` (hydration, HMR).
  // Update when the machine's LAN address changes.
  allowedDevOrigins: ["192.168.1.154"],
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
    ]);
  },
};

export default nextConfig;
