import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RewardUnlockedBanner } from "@/features/loyalty/components/reward-unlocked-banner";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { RewardImage } from "@/components/shared/reward-image";
import type { CardProgress, LoyaltyCardView } from "@/features/loyalty/types";
import { cn } from "@/lib/utils";

export interface LoyaltyCardItemProps {
  readonly card: LoyaltyCardView;
}

function ProgressSection({ progress }: { readonly progress: CardProgress }): ReactNode {
  const label = `${progress.stamps} / ${progress.threshold} passages`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-medium">
        <RewardImage url={progress.program.rewardImageUrl} />
        <span className="text-muted-foreground flex-1">
          {progress.program.rewardLabel}
        </span>
        <span className="text-accent shrink-0 font-semibold">{label}</span>
      </div>
      <Progress
        value={progress.progressPercent}
        aria-label={`Progression : ${label}`}
        className={cn(progress.isRewardUnlocked && "h-4")}
      />
      {progress.isRewardUnlocked ? <RewardUnlockedBanner /> : null}
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
        <RestaurantAvatar name={card.restaurantName} logoUrl={card.restaurantLogoUrl} />
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
