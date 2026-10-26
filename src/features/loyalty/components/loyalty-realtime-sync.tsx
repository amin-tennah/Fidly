"use client";

import type { ReactNode } from "react";
import { useLoyaltyCardsRealtime } from "@/features/loyalty/hooks/use-loyalty-cards-realtime";

interface LoyaltyRealtimeSyncProps {
  readonly userId: string;
}

/** Renders nothing: keeps the cards of the page up to date while it is open. */
export function LoyaltyRealtimeSync({ userId }: LoyaltyRealtimeSyncProps): ReactNode {
  useLoyaltyCardsRealtime(userId);
  return null;
}
