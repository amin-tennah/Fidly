import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { CelebrationPreview } from "@/features/loyalty";
import { InstallBanner, InstallSuccessOverlay } from "@/features/pwa";

export const metadata: Metadata = {
  title: "Aperçu DA",
  robots: { index: false, follow: false },
};

/**
 * Art-direction preview (06-DA-ITERATION-2 §8): the install banner and the celebrations on
 * made-up cards, to watch and measure them on a production build without an account.
 * Disabled (404) unless the server runs with DA_PREVIEW=1, which the e2e server sets. It
 * lives under /login because that prefix is already public: no route guard was changed.
 */
export default async function DaPreviewPage(): Promise<ReactNode> {
  // Read the variable at request time, not at build time.
  await connection();
  if (process.env.DA_PREVIEW !== "1") {
    notFound();
  }

  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-md space-y-5 p-5">
      <InstallBanner hasFirstVisit />
      <CelebrationPreview />
      <InstallSuccessOverlay />
    </main>
  );
}
