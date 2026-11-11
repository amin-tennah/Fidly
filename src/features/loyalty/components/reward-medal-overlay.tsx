"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/features/loyalty/components/confetti-burst";
import { RewardMedal } from "@/features/loyalty/components/reward-medal";
import { REWARD_MEDAL_CONFETTI } from "@/features/loyalty/constants";
import type { RewardCelebration } from "@/features/loyalty/types";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { useCloseOnEscape } from "@/lib/use-close-on-escape";
import { cn } from "@/lib/utils";

export interface RewardMedalOverlayProps {
  readonly celebration: RewardCelebration;
  /** Called on any touch, on Escape and by both buttons. */
  readonly onClose: () => void;
}

const TITLE_ID = "reward-medal-title";

/** Under reduced motion every text fades in at once instead of following the medal. */
function pickMotion(isReduced: boolean, motion: string): string {
  return isReduced ? "reduced-fade" : motion;
}

/** Both buttons close the overlay through its own click handler (they do not stop it). */
function MedalActions({ isReduced }: { readonly isReduced: boolean }): ReactNode {
  // The QR is at the top of the home, where this overlay lives: go back up to it.
  const showQr = (): void =>
    window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });

  return (
    <>
      <Button
        type="button"
        variant="gain"
        size="lg"
        autoFocus
        onClick={showQr}
        className={cn(
          "mt-2",
          pickMotion(isReduced, "animate-fade-up [animation-delay:2300ms]"),
        )}
      >
        Le montrer en caisse
      </Button>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "text-cream hover:text-cream hover:bg-white/10",
          pickMotion(isReduced, "animate-fade-up [animation-delay:2500ms]"),
        )}
      >
        Plus tard
      </Button>
    </>
  );
}

interface MedalTextProps {
  readonly celebration: RewardCelebration;
  readonly isReduced: boolean;
}

function MedalText({ celebration, isReduced }: MedalTextProps): ReactNode {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h2
        id={TITLE_ID}
        className={cn(
          "font-display text-gain text-[34px] leading-[1.02] font-extrabold tracking-[-0.02em]",
          pickMotion(isReduced, "animate-win-in [animation-delay:1700ms]"),
        )}
      >
        Récompense disponible
      </h2>
      <p
        className={cn(
          "text-cream text-lg font-semibold",
          pickMotion(isReduced, "animate-fade-up [animation-delay:1950ms]"),
        )}
      >
        {celebration.progress.program.rewardLabel} chez {celebration.restaurantName}
      </p>
      <MedalActions isReduced={isReduced} />
    </div>
  );
}

/**
 * "Récompense disponible" (06-DA-ITERATION-2 §3): full-screen medal, shown once when a
 * reward becomes available and kept until the customer touches the screen. Every touch
 * closes it; the main button also brings the QR back into view.
 */
export function RewardMedalOverlay({
  celebration,
  onClose,
}: RewardMedalOverlayProps): ReactNode {
  const [isReduced] = useState(prefersReducedMotion);
  useCloseOnEscape(onClose);
  const { stamps, threshold } = celebration.progress;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      onClick={onClose}
      className={cn(
        "bg-foreground/82 pb-safe-6 pt-safe-6 fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 overflow-hidden px-6",
        isReduced ? "reduced-fade" : "animate-fade-in",
      )}
    >
      {isReduced ? null : (
        <ConfettiBurst
          burst={REWARD_MEDAL_CONFETTI}
          hue={celebration.hue}
          className="top-[38%]"
        />
      )}
      <RewardMedal label={`${stamps} / ${threshold}`} isAnimated={!isReduced} />
      <MedalText celebration={celebration} isReduced={isReduced} />
    </div>
  );
}
