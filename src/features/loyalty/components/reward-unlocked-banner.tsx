"use client";

import type { ReactNode } from "react";
import { useIsLateMount } from "@/features/loyalty/hooks/use-is-late-mount";
import { cn } from "@/lib/utils";

/** Mounted after first paint means the reward was just unlocked: celebrate once. */
const FIRST_PAINT_GRACE_MS = 4000;

export function RewardUnlockedBanner(): ReactNode {
  const isJustUnlocked = useIsLateMount(FIRST_PAINT_GRACE_MS);

  return (
    <p
      role="status"
      className={cn(
        "text-accent rounded-lg text-sm font-bold",
        isJustUnlocked && "motion-safe:animate-reward-pop",
      )}
    >
      Récompense disponible en caisse !
    </p>
  );
}
