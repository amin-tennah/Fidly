import type { MetadataRoute } from "next";

/** PWA manifest. Icons and colours: Documentation/05-DIRECTION-ARTISTIQUE.md §1 and §8 (DA.7). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rézone",
    short_name: "Rézone",
    description: "Ta carte de fidélité pour les commerces de ton quartier.",
    lang: "fr",
    // Stable identity: the installed app survives a later change of `start_url`.
    id: "/",
    scope: "/",
    start_url: "/",
    display: "standalone",
    theme_color: "#0a5c3a",
    background_color: "#fbf6ec",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
