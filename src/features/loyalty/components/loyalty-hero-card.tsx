import type { ReactNode } from "react";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { PlusOneBurst } from "@/features/loyalty/components/plus-one-burst";
import { SegmentedProgress } from "@/features/loyalty/components/segmented-progress";
import { describeCardMessage } from "@/features/loyalty/domain/card-message";
import { getCardHue } from "@/features/loyalty/domain/card-hue";
import type { CardProgress, LoyaltyCardView } from "@/features/loyalty/types";
import { cn } from "@/lib/utils";

export interface LoyaltyHeroCardProps {
  readonly card: LoyaltyCardView;
  readonly progress: CardProgress;
  readonly justAdded?: boolean;
}

interface HeroCounterProps {
  readonly stamps: number;
  readonly threshold: number;
  readonly hue: number;
  readonly justAdded: boolean;
}

function HeroCounter({ stamps, threshold, hue, justAdded }: HeroCounterProps): ReactNode {
  return (
    <p className="flex items-baseline gap-2">
      <span
        className={cn(
          "font-display text-[92px] leading-none font-extrabold",
          justAdded && "animate-bump",
        )}
        style={{ color: `var(--hue-${hue}-dark)` }}
      >
        {stamps}
      </span>
      <span className="font-display text-2xl font-bold opacity-90">/ {threshold}</span>
    </p>
  );
}

function HeroTitle({
  card,
  progress,
}: Omit<LoyaltyHeroCardProps, "justAdded">): ReactNode {
  return (
    <div className="flex items-center gap-3">
      <RestaurantAvatar
        name={card.restaurantName}
        logoUrl={card.restaurantLogoUrl}
        size="lg"
      />
      <div className="min-w-0">
        <h2 className="font-display truncate text-xl font-extrabold">
          {card.restaurantName}
        </h2>
        <p className="text-sm opacity-90">{progress.program.rewardLabel}</p>
      </div>
    </div>
  );
}

/** Large forest card of a restaurant: logo, tier, big counter, segments and message. */
export function LoyaltyHeroCard({
  card,
  progress,
  justAdded = false,
}: LoyaltyHeroCardProps): ReactNode {
  const hue = getCardHue(card.restaurantId);
  const { stamps, threshold } = progress;

  return (
    <section
      aria-label={`Ta carte ${card.restaurantName}`}
      className="bg-primary text-primary-foreground relative space-y-4 rounded-[28px] p-5 shadow-lg"
    >
      <HeroTitle card={card} progress={progress} />
      <HeroCounter
        stamps={stamps}
        threshold={threshold}
        hue={hue}
        justAdded={justAdded}
      />
      <SegmentedProgress
        count={stamps}
        threshold={threshold}
        hue={hue}
        justAdded={justAdded}
        tone="card"
      />
      <p role="status" className="text-sm font-semibold">
        {describeCardMessage(progress)}
      </p>
      {justAdded ? <PlusOneBurst hue={hue} /> : null}
    </section>
  );
}
