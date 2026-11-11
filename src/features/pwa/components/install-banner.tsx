"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IosInstallSteps } from "@/features/pwa/components/ios-install-steps";
import { useInstallBanner } from "@/features/pwa/hooks/use-install-banner";

export interface InstallBannerProps {
  /** True once a first visit was credited (the customer has a card). */
  readonly hasFirstVisit: boolean;
}

/** Proposes to add Rézone to the home screen (roadmap 8.3); a refusal is remembered. */
export function InstallBanner({ hasFirstVisit }: InstallBannerProps): ReactNode {
  const { mode, install, dismiss } = useInstallBanner(hasFirstVisit);

  if (mode === "hidden") {
    return null;
  }
  return (
    <section
      aria-labelledby="install-banner-title"
      className="border-primary bg-gain/30 space-y-3 rounded-2xl border-2 p-4"
    >
      <div className="space-y-1">
        <h2 id="install-banner-title" className="font-display text-lg font-extrabold">
          Garde Rézone sous la main
        </h2>
        <p className="text-sm">Ton QR s&apos;ouvre en un geste, même sans réseau.</p>
      </div>
      {mode === "ios-guide" ? <IosInstallSteps /> : null}
      <div className="flex gap-2">
        {mode === "prompt" ? (
          <Button type="button" onClick={install} className="flex-1">
            Installer
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={dismiss} className="flex-1">
          {mode === "prompt" ? "Plus tard" : "J'ai compris"}
        </Button>
      </div>
    </section>
  );
}
