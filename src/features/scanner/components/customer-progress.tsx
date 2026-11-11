import { Gift } from "lucide-react";
import type { ReactNode } from "react";
import { SegmentedProgress } from "@/features/loyalty";
import type { CustomerLookup, ScanOutcome } from "@/features/scanner/types";

interface CustomerProgressProps {
  readonly card: Pick<
    CustomerLookup | ScanOutcome,
    "stamps" | "threshold" | "rewardLabel" | "isRewardUnlocked"
  >;
  /** Card colour index, 1 to 6 (see getCardHue). */
  readonly hue: number;
}

/** The customer's card as the cashier sees it: counter, one segment per visit, reward state. */
export function CustomerProgress({ card, hue }: CustomerProgressProps): ReactNode {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground text-sm">{card.rewardLabel}</span>
        <span className="font-display text-4xl font-extrabold tabular-nums">
          {card.stamps} / {card.threshold}
        </span>
      </div>
      <SegmentedProgress count={card.stamps} threshold={card.threshold} hue={hue} />
      {card.isRewardUnlocked ? (
        <p
          role="status"
          className="bg-gain text-gain-foreground flex items-center gap-2 rounded-xl p-3 text-base font-extrabold"
        >
          <Gift className="size-5 shrink-0" aria-hidden="true" />
          Récompense à remettre
        </p>
      ) : null}
    </div>
  );
}
