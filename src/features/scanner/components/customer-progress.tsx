import type { ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import type { CustomerLookup, ScanOutcome } from "@/features/scanner/types";

interface CustomerProgressProps {
  readonly card: Pick<
    CustomerLookup | ScanOutcome,
    "stamps" | "threshold" | "rewardLabel" | "isRewardUnlocked"
  >;
}

export function CustomerProgress({ card }: CustomerProgressProps): ReactNode {
  const percent = Math.round(Math.min(1, card.stamps / card.threshold) * 100);
  const label = `${card.stamps} / ${card.threshold}`;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground text-sm">{card.rewardLabel}</span>
        <span className="text-3xl font-bold tabular-nums">{label}</span>
      </div>
      <Progress value={percent} aria-label={`Progression : ${label}`} className="h-4" />
      {card.isRewardUnlocked ? (
        <p role="status" className="text-primary text-sm font-bold">
          Récompense disponible !
        </p>
      ) : null}
    </div>
  );
}
