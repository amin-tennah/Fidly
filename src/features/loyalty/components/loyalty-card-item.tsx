import type { ReactNode } from "react";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { RewardImage } from "@/components/shared/reward-image";
import { Card } from "@/components/ui/card";
import { LoyaltyCardProgress } from "@/features/loyalty/components/loyalty-card-progress";
import { RewardUnlockedBanner } from "@/features/loyalty/components/reward-unlocked-banner";
import { getCardHue } from "@/features/loyalty/domain/card-hue";
import type { CardProgress, LoyaltyCardView } from "@/features/loyalty/types";
import { cn } from "@/lib/utils";

export interface LoyaltyCardItemProps {
  readonly card: LoyaltyCardView;
}

interface ProgressSectionProps {
  readonly progress: CardProgress;
  readonly hue: number;
}

function ProgressSection({ progress, hue }: ProgressSectionProps): ReactNode {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <RewardImage url={progress.program.rewardImageUrl} />
        <span className="text-muted-foreground flex-1">
          {progress.program.rewardLabel}
        </span>
        <span className="text-primary font-display shrink-0 text-base font-bold">
          {progress.stamps} / {progress.threshold}
        </span>
      </div>
      <LoyaltyCardProgress
        count={progress.stamps}
        threshold={progress.threshold}
        hue={hue}
        tone="list"
      />
      {progress.isRewardUnlocked ? <RewardUnlockedBanner /> : null}
    </div>
  );
}

export function LoyaltyCardItem({ card }: LoyaltyCardItemProps): ReactNode {
  const { progress } = card;
  const isUnlocked = progress?.isRewardUnlocked ?? false;

  return (
    <Card className={cn(isUnlocked && "border-primary bg-gain/20")}>
      <div className="flex items-center gap-3">
        <RestaurantAvatar name={card.restaurantName} logoUrl={card.restaurantLogoUrl} />
        <h3 className="font-display text-lg font-bold">{card.restaurantName}</h3>
      </div>
      {progress ? (
        <ProgressSection progress={progress} hue={getCardHue(card.restaurantId)} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Programme de fidélité momentanément indisponible.
        </p>
      )}
    </Card>
  );
}
