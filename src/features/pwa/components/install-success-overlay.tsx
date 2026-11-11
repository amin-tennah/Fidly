"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BenefitIcon } from "@/features/pwa/components/benefit-icon";
import { HomeScreenDrop } from "@/features/pwa/components/home-screen-drop";
import {
  INSTALL_BENEFITS,
  INSTALL_SUCCESS_FIRST_ROW_MS,
  INSTALL_SUCCESS_ROW_STEP_MS,
} from "@/features/pwa/constants";
import { useInstallSuccess } from "@/features/pwa/hooks/use-install-success";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { useCloseOnEscape } from "@/lib/use-close-on-escape";
import { cn } from "@/lib/utils";

const TITLE_ID = "install-success-title";

/** Under reduced motion everything fades in at once instead of following the icon. */
function pickMotion(isReduced: boolean, motion: string): string {
  return isReduced ? "reduced-fade" : motion;
}

function rowDelay(index: number, isReduced: boolean): CSSProperties | undefined {
  if (isReduced) {
    return undefined;
  }
  const delayMs = INSTALL_SUCCESS_FIRST_ROW_MS + index * INSTALL_SUCCESS_ROW_STEP_MS;
  return { animationDelay: `${delayMs}ms` };
}

function BenefitRows({ isReduced }: { readonly isReduced: boolean }): ReactNode {
  return (
    <ul className="w-full space-y-2">
      {INSTALL_BENEFITS.map((benefit, index) => (
        <li
          key={benefit.icon}
          className={cn(
            "bg-cream/12 text-cream flex h-[46px] items-center gap-3 rounded-[14px] px-3.5 text-left text-[15px] font-extrabold",
            pickMotion(isReduced, "animate-fade-up"),
          )}
          style={rowDelay(index, isReduced)}
        >
          <BenefitIcon name={benefit.icon} className="text-gain size-6 shrink-0" />
          {benefit.sentence}
        </li>
      ))}
    </ul>
  );
}

function SuccessTitle({ isReduced }: { readonly isReduced: boolean }): ReactNode {
  return (
    <h2
      id={TITLE_ID}
      className={cn(
        "font-display text-cream text-[31px] leading-[1.05] font-extrabold tracking-[-0.02em]",
        pickMotion(isReduced, "animate-fade-up [animation-delay:1550ms]"),
      )}
    >
      Rézone est sur ton écran d&apos;accueil
    </h2>
  );
}

function InstallSuccessDialog({ onClose }: { readonly onClose: () => void }): ReactNode {
  const [isReduced] = useState(prefersReducedMotion);
  useCloseOnEscape(onClose);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      className={cn(
        "bg-foreground/86 pb-safe-6 pt-safe-6 fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden px-7 text-center",
        pickMotion(isReduced, "animate-fade-in"),
      )}
    >
      <HomeScreenDrop isAnimated={!isReduced} />
      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <SuccessTitle isReduced={isReduced} />
        <BenefitRows isReduced={isReduced} />
        <Button
          type="button"
          variant="gain"
          size="lg"
          autoFocus
          onClick={onClose}
          className={cn(
            "mt-2 px-8",
            pickMotion(isReduced, "animate-fade-up [animation-delay:2550ms]"),
          )}
        >
          Compris
        </Button>
      </div>
    </div>
  );
}

/**
 * "Rézone est sur ton écran d'accueil" (06-DA-ITERATION-2 §5): played once the browser
 * reports the installation, and kept until "Compris". Mounted next to the install banner,
 * not inside it: the banner disappears at that very moment.
 */
export function InstallSuccessOverlay(): ReactNode {
  const { isVisible, dismiss } = useInstallSuccess();
  return isVisible ? <InstallSuccessDialog onClose={dismiss} /> : null;
}
