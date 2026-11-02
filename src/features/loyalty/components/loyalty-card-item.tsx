import type { ReactNode } from "react";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { Card } from "@/components/ui/card";
import { LoyaltyCardProgress } from "@/features/loyalty/components/loyalty-card-progress";
import { RewardUnlockedBanner } from "@/features/loyalty/components/reward-unlocked-banner";
import { getCardHue } from "@/features/loyalty/domain/card-hue";
import type { CardProgress, LoyaltyCardView } from "@/features/loyalty/types";
import { cn } from "@/lib/utils";

export interface LoyaltyCardItemProps {
  readonly card: LoyaltyCardView;
}

function Counter({ progress }: { readonly progress: CardProgress }): ReactNode {
  return (
    <p className="font-display shrink-0 text-[22px] leading-none font-extrabold tracking-[-0.04em]">
      {progress.stamps}
      <span className="text-muted-foreground ml-1 text-sm font-bold tracking-normal">
        / {progress.threshold}
      </span>
    </p>
  );
}

function CardHeaderRow({ card }: LoyaltyCardItemProps): ReactNode {
  const { progress } = card;
  return (
    <div className="flex items-center gap-3">
      <RestaurantAvatar
        name={card.restaurantName}
        logoUrl={card.restaurantLogoUrl}
        size="list"
        shape="tile"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base leading-tight font-extrabold">
          {card.restaurantName}
        </h3>
        {progress ? (
          <p className="text-muted-foreground truncate text-[13px]">
            {progress.program.rewardLabel}
          </p>
        ) : null}
      </div>
      {progress ? <Counter progress={progress} /> : null}
    </div>
  );
}

export function LoyaltyCardItem({ card }: LoyaltyCardItemProps): ReactNode {
  const { progress } = card;
  const isUnlocked = progress?.isRewardUnlocked ?? false;

  return (
    <Card
      className={cn(
        "gap-2.5 rounded-[20px] p-3.5",
        isUnlocked && "border-primary bg-gain/20",
      )}
    >
      <CardHeaderRow card={card} />
      {progress ? (
        <>
          <LoyaltyCardProgress
            count={progress.stamps}
            threshold={progress.threshold}
            hue={getCardHue(card.restaurantId)}
            tone="list"
          />
          {isUnlocked ? <RewardUnlockedBanner /> : null}
        </>
      ) : (
        <p className="text-muted-foreground text-sm">
          Programme de fidélité momentanément indisponible.
        </p>
      )}
    </Card>
  );
}
