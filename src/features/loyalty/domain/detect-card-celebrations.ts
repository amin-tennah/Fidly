import { getCardHue } from "@/features/loyalty/domain/card-hue";
import type {
  CardCelebration,
  CardProgress,
  LoyaltyCardView,
} from "@/features/loyalty/types";

function isRewardNew(previous: CardProgress | null, next: CardProgress): boolean {
  if (!next.isRewardUnlocked) {
    return false;
  }
  const wasUnlocked =
    previous !== null &&
    previous.isRewardUnlocked &&
    previous.program.id === next.program.id;
  return !wasUnlocked;
}

function celebrateCard(
  previous: LoyaltyCardView | undefined,
  card: LoyaltyCardView,
): CardCelebration[] {
  const next = card.progress;
  if (!next) {
    return [];
  }
  const before = previous?.progress ?? null;
  if (before && next.stamps < before.stamps) {
    // A cancelled visit: nothing to celebrate, even if the tier changed.
    return [];
  }
  const base = {
    cardId: card.cardId,
    restaurantName: card.restaurantName,
    restaurantLogoUrl: card.restaurantLogoUrl,
    hue: getCardHue(card.restaurantId),
    progress: next,
  };
  const events: CardCelebration[] = [];
  // A card seen for the first time has no "before": its counter cannot roll.
  if (before && next.stamps > before.stamps) {
    events.push({ ...base, kind: "stamp", from: before.stamps, to: next.stamps });
  }
  if (isRewardNew(before, next)) {
    events.push({ ...base, kind: "reward" });
  }
  return events;
}

/**
 * Compares two server reads of the customer's cards and lists what to celebrate, in play
 * order: for one card, the stamp first, then its reward. `previous` is null on the first
 * render, which never celebrates (the cards were already like this). Never optimistic:
 * both lists come from the server.
 */
export function detectCardCelebrations(
  previous: readonly LoyaltyCardView[] | null,
  next: readonly LoyaltyCardView[],
): CardCelebration[] {
  if (previous === null) {
    return [];
  }
  const byId = new Map(previous.map((card) => [card.cardId, card]));
  return next.flatMap((card) => celebrateCard(byId.get(card.cardId), card));
}
