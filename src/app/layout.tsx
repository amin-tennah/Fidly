import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Fidly — Fidélité Zéro Friction",
    template: "%s | Fidly",
  },
  description:
    "Un seul QR code personnel pour vos restaurants de quartier. Cumulez vos passages et débloquez vos récompenses en moins de 3 secondes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="fr">
      <body className="bg-background text-foreground min-h-dvh antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
