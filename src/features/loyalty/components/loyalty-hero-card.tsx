"use client";

import type { ReactNode } from "react";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { PlusOneBurst } from "@/features/loyalty/components/plus-one-burst";
import { SegmentedProgress } from "@/features/loyalty/components/segmented-progress";
import { getCardHue } from "@/features/loyalty/domain/card-hue";
import { describeCardMessage } from "@/features/loyalty/domain/card-message";
import { useJustAdded } from "@/features/loyalty/hooks/use-just-added";
import type { CardProgress, LoyaltyCardView } from "@/features/loyalty/types";
import { cn } from "@/lib/utils";

export interface LoyaltyHeroCardProps {
  readonly card: LoyaltyCardView;
  readonly progress: CardProgress;
}

interface HeroCounterProps {
  readonly stamps: number;
  readonly threshold: number;
  readonly hue: number;
  readonly justAdded: boolean;
}

function HeroCounter({ stamps, threshold, hue, justAdded }: HeroCounterProps): ReactNode {
  return (
    <p className="font-display flex items-baseline gap-2 tracking-[-0.04em]">
      <span
        className={cn(
          "text-[92px] leading-[0.9] font-extrabold",
          justAdded && "animate-bump",
        )}
        style={{ color: `var(--hue-${hue}-dark)` }}
      >
        {stamps}
      </span>
      <span className="text-[32px] font-extrabold opacity-80">/ {threshold}</span>
    </p>
  );
}

function HeroTitle({ card, progress }: LoyaltyHeroCardProps): ReactNode {
  return (
    <div className="flex items-center gap-3">
      <RestaurantAvatar
        name={card.restaurantName}
        logoUrl={card.restaurantLogoUrl}
        size="hero"
        shape="tile"
        className="bg-cream text-primary"
      />
      <div className="min-w-0">
        <h2 className="font-display truncate text-[17px] font-extrabold">
          {card.restaurantName}
        </h2>
        <p className="text-[13px] opacity-90">
          Palier {progress.program.position} · {progress.program.rewardLabel} à{" "}
          {progress.threshold}
        </p>
      </div>
    </div>
  );
}

interface HeroMessageProps {
  readonly progress: CardProgress;
  readonly hue: number;
}

function HeroMessage({ progress, hue }: HeroMessageProps): ReactNode {
  if (!progress.isRewardUnlocked) {
    return (
      <p role="status" className="font-display text-xl leading-tight font-bold">
        {describeCardMessage(progress)}
      </p>
    );
  }
  return (
    <div
      role="status"
      className="animate-win-in text-primary rounded-2xl px-4 py-3"
      style={{ backgroundColor: `var(--hue-${hue}-dark)` }}
    >
      <p className="font-display text-[22px] leading-tight font-extrabold">
        C&apos;est gagné !
      </p>
      <p className="text-sm font-semibold">Montre cet écran en caisse.</p>
    </div>
  );
}

/** Large forest card of a restaurant: logo, tier, big counter, segments and message. */
export function LoyaltyHeroCard({ card, progress }: LoyaltyHeroCardProps): ReactNode {
  const hue = getCardHue(card.restaurantId);
  const justAdded = useJustAdded(progress.stamps);

  return (
    <section
      aria-label={`Ta carte ${card.restaurantName}`}
      className="bg-primary text-primary-foreground relative space-y-3.5 rounded-[28px] p-5 shadow-[0_10px_24px_rgb(10_92_58/0.22)]"
    >
      <HeroTitle card={card} progress={progress} />
      <HeroCounter
        stamps={progress.stamps}
        threshold={progress.threshold}
        hue={hue}
        justAdded={justAdded}
      />
      <SegmentedProgress
        count={progress.stamps}
        threshold={progress.threshold}
        hue={hue}
        justAdded={justAdded}
        tone="card"
      />
      <HeroMessage progress={progress} hue={hue} />
      {justAdded ? <PlusOneBurst hue={hue} /> : null}
    </section>
  );
}
