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
      <h2 id="loyalty-cards-heading" className="text-lg font-semibold tracking-tight">
        Mes cartes de fidélité
      </h2>
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
