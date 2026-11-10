import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
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
        <h1 className="font-display text-[28px] leading-[1.05] font-extrabold tracking-[-0.02em]">
          Cette page n&apos;existe pas
        </h1>
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
