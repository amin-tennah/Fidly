import type { ReactNode } from "react";
import { LoyaltyCardItem } from "@/features/loyalty/components/loyalty-card-item";
import { LoyaltyCardsEmptyState } from "@/features/loyalty/components/loyalty-cards-empty-state";
import type { LoyaltyCardView } from "@/features/loyalty/types";

export interface LoyaltyCardsListProps {
  readonly cards: readonly LoyaltyCardView[];
}

export function LoyaltyCardsList({ cards }: LoyaltyCardsListProps): ReactNode {
  return (
    <section aria-labelledby="loyalty-cards-heading" className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id="loyalty-cards-heading"
          className="font-display text-[21px] font-extrabold tracking-tight"
        >
          Mes cartes
        </h2>
        <p className="text-primary text-[13px] font-extrabold">
          {cards.length} {cards.length > 1 ? "commerces" : "commerce"}
        </p>
      </div>
      {cards.length === 0 ? (
        <LoyaltyCardsEmptyState />
      ) : (
        <ul className="space-y-3">
          {cards.map((card) => (
            <li key={card.cardId}>
              <LoyaltyCardItem card={card} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
