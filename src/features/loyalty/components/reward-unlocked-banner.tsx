"use client";

import type { ReactNode } from "react";
import { FIRST_PAINT_GRACE_MS } from "@/features/loyalty/constants";
import { useIsLateMount } from "@/features/loyalty/hooks/use-is-late-mount";
import { cn } from "@/lib/utils";

export function RewardUnlockedBanner(): ReactNode {
  const isJustUnlocked = useIsLateMount(FIRST_PAINT_GRACE_MS);

  return (
    <p
      role="status"
      className={cn(
        "text-primary rounded-lg text-sm font-bold",
        isJustUnlocked && "motion-safe:animate-reward-pop",
      )}
    >
      Récompense disponible en caisse !
    </p>
  );
}
