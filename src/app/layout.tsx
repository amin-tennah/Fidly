import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bricolage",
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Rézone — Fidélité Zéro Friction",
    template: "%s | Rézone",
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  // "default" keeps the iOS status bar outside the page: its text stays readable on the
  // cream and white screens, which "black-translucent" (white text) would not allow.
  appleWebApp: {
    capable: true,
    title: "Rézone",
    statusBarStyle: "default",
  },
  description:
    "Un seul QR code personnel pour vos restaurants de quartier. Cumulez vos passages et débloquez vos récompenses en moins de 3 secondes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Edge to edge: the page handles the cut-outs itself (`--safe-top`, `--safe-bottom`).
  viewportFit: "cover",
  themeColor: "#0a5c3a",
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="fr" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="bg-background text-foreground min-h-dvh antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
