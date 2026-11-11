"use client";

import type { ReactNode } from "react";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { ConfettiBurst } from "@/features/loyalty/components/confetti-burst";
import { SegmentedProgress } from "@/features/loyalty/components/segmented-progress";
import { SCAN_REVEAL_CONFETTI } from "@/features/loyalty/constants";
import { describeCardMessage } from "@/features/loyalty/domain/card-message";
import { useScanReveal } from "@/features/loyalty/hooks/use-scan-reveal";
import type { StampCelebration } from "@/features/loyalty/types";
import { cn } from "@/lib/utils";

export interface ScanRevealOverlayProps {
  readonly celebration: StampCelebration;
  /** Called when the animation is over, or as soon as the customer touches the screen. */
  readonly onDone: () => void;
}

interface RevealProps {
  readonly celebration: StampCelebration;
  readonly isReduced: boolean;
}

function RevealTitle({ celebration }: Pick<RevealProps, "celebration">): ReactNode {
  const { program, threshold } = celebration.progress;
  return (
    <div className="flex items-center gap-3">
      <RestaurantAvatar
        name={celebration.restaurantName}
        logoUrl={celebration.restaurantLogoUrl}
        size="hero"
        shape="tile"
        className="bg-cream text-foreground"
      />
      <div className="min-w-0">
        <p className="truncate text-[17px] font-extrabold">
          {celebration.restaurantName}
        </p>
        <p className="text-[13px] opacity-90">
          Palier {program.position} · {program.rewardLabel} à {threshold}
        </p>
      </div>
    </div>
  );
}

/** Big counter: the old number rolls out upwards, the new one rolls in from below. */
function RevealCounter({ celebration, isReduced }: RevealProps): ReactNode {
  return (
    <p
      aria-hidden="true"
      className="font-display flex h-[92px] items-baseline gap-2 overflow-hidden tracking-[-0.04em]"
    >
      <span
        className="relative text-[92px] leading-[0.95] font-extrabold"
        style={{ color: `var(--hue-${celebration.hue}-dark)` }}
      >
        {isReduced ? null : (
          <span className="animate-roll-out absolute top-0 left-0">
            {celebration.from}
          </span>
        )}
        <span className={cn("block", !isReduced && "animate-roll-in")}>
          {celebration.to}
        </span>
      </span>
      <span className="text-[32px] font-extrabold opacity-80">
        / {celebration.progress.threshold}
      </span>
    </p>
  );
}

interface RevealCardProps extends RevealProps {
  readonly isCounted: boolean;
}

/** The forest card itself: title, counter, segments and the sentence of the hero card. */
function RevealCard({ celebration, isReduced, isCounted }: RevealCardProps): ReactNode {
  const { progress, hue, from, to } = celebration;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "bg-primary text-primary-foreground rounded-screen shadow-overlay w-full max-w-sm space-y-3.5 px-5 py-[22px]",
        !isReduced && "animate-card-reveal",
      )}
    >
      <RevealTitle celebration={celebration} />
      <RevealCounter celebration={celebration} isReduced={isReduced} />
      <p className="sr-only">
        {to} passages sur {progress.threshold}
      </p>
      <SegmentedProgress
        count={isCounted ? to : from}
        threshold={progress.threshold}
        hue={hue}
        justAdded={isCounted && !isReduced}
        tone="card"
      />
      <p className="font-display text-xl leading-[1.15] font-extrabold">
        {describeCardMessage(progress)}
      </p>
    </div>
  );
}

/**
 * Scan celebration "carte dévoilée" (06-DA-ITERATION-2 §2): the card of the restaurant
 * comes to the centre of the screen and its counter changes. Client side only, played once
 * the server confirmed the stamp. It never blocks the screen: touches go through.
 */
export function ScanRevealOverlay({
  celebration,
  onDone,
}: ScanRevealOverlayProps): ReactNode {
  const { isReduced, isCounted } = useScanReveal(onDone);

  return (
    <div
      className={cn(
        "bg-foreground/62 pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-9",
        isReduced ? "reduced-fade" : "animate-veil-pass",
      )}
    >
      <RevealCard celebration={celebration} isReduced={isReduced} isCounted={isCounted} />
      {isReduced ? null : (
        <ConfettiBurst
          burst={SCAN_REVEAL_CONFETTI}
          hue={celebration.hue}
          className="top-[calc(50%-30px)]"
        />
      )}
    </div>
  );
}
