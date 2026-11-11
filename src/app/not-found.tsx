import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ScreenTitle } from "@/components/shared/screen-title";
import { Button } from "@/components/ui/button";
import { CLIENT_HOME_PATH } from "@/features/auth";

export const metadata: Metadata = {
  title: "Page introuvable",
};

/** Shown for an unknown address or a card the customer does not have. */
export default function NotFound(): ReactNode {
  return (
    <div className="bg-cream">
      <main className="pt-safe-14 pb-safe-7 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <BrandLogo tone="forest" width={160} />
        <ScreenTitle>Cette page n&apos;existe pas</ScreenTitle>
        <p className="text-muted-foreground text-base">
          Le lien est peut-être ancien, ou la carte n&apos;est plus disponible.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link href={CLIENT_HOME_PATH}>Retour à mes cartes</Link>
        </Button>
      </main>
    </div>
  );
}
