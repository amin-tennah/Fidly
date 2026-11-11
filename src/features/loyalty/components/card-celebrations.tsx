"use client";

import type { ReactNode } from "react";
import { RewardMedalOverlay } from "@/features/loyalty/components/reward-medal-overlay";
import { ScanRevealOverlay } from "@/features/loyalty/components/scan-reveal-overlay";
import { useCardCelebrations } from "@/features/loyalty/hooks/use-card-celebrations";
import type { LoyaltyCardView } from "@/features/loyalty/types";

export interface CardCelebrationsProps {
  /** The customer's cards as last read by the server. */
  readonly cards: readonly LoyaltyCardView[];
}

/**
 * Full-screen celebrations of the client home (06-DA-ITERATION-2 §2 and §3), mounted once
 * for the whole list: the scan reveal when a stamp arrives, then the medal if it unlocked
 * a reward. One overlay at a time. Never mounted on the cashier screens.
 */
export function CardCelebrations({ cards }: CardCelebrationsProps): ReactNode {
  const { current, dismiss } = useCardCelebrations(cards);

  if (!current) {
    return null;
  }
  // A new key restarts the animation when two celebrations of the same kind follow.
  const key = `${current.kind}:${current.cardId}:${current.progress.stamps}`;
  switch (current.kind) {
    case "stamp":
      return <ScanRevealOverlay key={key} celebration={current} onDone={dismiss} />;
    case "reward":
      return <RewardMedalOverlay key={key} celebration={current} onClose={dismiss} />;
    default: {
      const _exhaustive: never = current;
      return _exhaustive;
    }
  }
}
