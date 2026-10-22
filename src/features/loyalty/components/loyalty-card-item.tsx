import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CardProgress, LoyaltyCardView } from "@/features/loyalty/types";
import { cn } from "@/lib/utils";

export interface LoyaltyCardItemProps {
  readonly card: LoyaltyCardView;
}

function RestaurantInitial({ name }: { readonly name: string }): ReactNode {
  return (
    <span
      aria-hidden="true"
      className="bg-secondary text-secondary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function ProgressSection({ progress }: { readonly progress: CardProgress }): ReactNode {
  const label = `${progress.stamps} / ${progress.threshold} passages`;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between gap-2 text-xs font-medium">
        <span className="text-muted-foreground">{progress.program.rewardLabel}</span>
        <span className="text-accent shrink-0 font-semibold">{label}</span>
      </div>
      <Progress
        value={progress.progressPercent}
        aria-label={`Progression : ${label}`}
        className={cn(progress.isRewardUnlocked && "h-4")}
      />
      {progress.isRewardUnlocked ? (
        <p role="status" className="text-accent text-sm font-bold">
          Récompense disponible en caisse !
        </p>
      ) : null}
    </div>
  );
}

export function LoyaltyCardItem({ card }: LoyaltyCardItemProps): ReactNode {
  const { progress } = card;
  const isUnlocked = progress?.isRewardUnlocked ?? false;

  return (
    <Card
      className={cn(
        isUnlocked && "border-accent bg-emerald-50 ring-1 ring-emerald-500/40",
      )}
    >
      <div className="flex items-center gap-3">
        <RestaurantInitial name={card.restaurantName} />
        <h3 className="text-base font-semibold">{card.restaurantName}</h3>
      </div>
      {progress ? (
        <ProgressSection progress={progress} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Programme de fidélité momentanément indisponible.
        </p>
      )}
    </Card>
  );
}
