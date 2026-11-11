"use client";

import { useCallback, useEffect, useState } from "react";
import { detectCardCelebrations } from "@/features/loyalty/domain/detect-card-celebrations";
import {
  getRewardKey,
  hasSeenReward,
  markRewardSeen,
} from "@/features/loyalty/reward-seen-storage";
import type { CardCelebration, LoyaltyCardView } from "@/features/loyalty/types";

export interface UseCardCelebrationsReturn {
  /** The celebration to show now, or null. Only one at a time. */
  readonly current: CardCelebration | null;
  /** Ends the current celebration and moves on to the next one in the queue. */
  readonly dismiss: () => void;
}

function isWorthPlaying(celebration: CardCelebration): boolean {
  return celebration.kind === "stamp" || !hasSeenReward(getRewardKey(celebration));
}

/**
 * Queues what to celebrate each time the server sends new cards (Realtime →
 * `router.refresh()`), and plays the queue one overlay at a time. Never optimistic: nothing
 * is queued before the new props arrive, and never on the first render.
 */
export function useCardCelebrations(
  cards: readonly LoyaltyCardView[],
): UseCardCelebrationsReturn {
  const [previous, setPrevious] = useState(cards);
  const [queue, setQueue] = useState<readonly CardCelebration[]>([]);

  if (cards !== previous) {
    setPrevious(cards);
    const events = detectCardCelebrations(previous, cards).filter(isWorthPlaying);
    if (events.length > 0) {
      setQueue([...queue, ...events]);
    }
  }

  const current = queue[0] ?? null;
  useEffect(() => {
    if (current?.kind === "reward") {
      markRewardSeen(getRewardKey(current));
    }
  }, [current]);

  const dismiss = useCallback((): void => {
    setQueue((pending) => pending.slice(1));
  }, []);

  return { current, dismiss };
}
