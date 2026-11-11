"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AndroidInstallSteps } from "@/features/pwa/components/android-install-steps";
import { AppIcon } from "@/features/pwa/components/app-icon";
import { InstallBenefits } from "@/features/pwa/components/install-benefits";
import { IosInstallSteps } from "@/features/pwa/components/ios-install-steps";
import { useInstallBanner } from "@/features/pwa/hooks/use-install-banner";

export interface InstallBannerProps {
  /** True once a first visit was credited (the customer has a card). */
  readonly hasFirstVisit: boolean;
}

const APP_ICON_SIZE_PX = 56;

function BannerHeading(): ReactNode {
  return (
    <div className="flex items-center gap-3">
      <AppIcon size={APP_ICON_SIZE_PX} className="drop-shadow-app-icon" />
      <div className="space-y-1">
        <h2
          id="install-banner-title"
          className="font-display text-[19px] leading-[1.1] font-extrabold"
        >
          Ajoute Rézone à tes applis
        </h2>
        <p className="text-muted-foreground text-[13px] leading-snug">
          Ton QR et tes cartes s&apos;ouvrent en un geste, comme une vraie appli.
        </p>
      </div>
    </div>
  );
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
      className="bg-card border-border rounded-panel shadow-banner space-y-3 border-2 p-4"
    >
      <BannerHeading />
      <InstallBenefits />
      {mode === "ios-guide" ? <IosInstallSteps /> : null}
      {mode === "android-guide" ? <AndroidInstallSteps /> : null}
      <div className="flex items-center gap-2.5">
        {mode === "prompt" ? (
          <Button type="button" size="lg" onClick={install} className="flex-[1.5]">
            Installer
          </Button>
        ) : null}
        {mode === "prompt" ? null : (
          <Button
            type="button"
            variant="outline"
            onClick={dismiss}
            className="text-primary min-h-14 flex-1 font-sans text-[15px] font-extrabold"
          >
            J&apos;ai compris
          </Button>
        )}
      </div>
    </section>
  );
}
