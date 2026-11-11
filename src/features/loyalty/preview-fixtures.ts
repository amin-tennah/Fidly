import { computeCardProgress } from "@/features/loyalty/domain/compute-card-progress";
import type { LoyaltyCardView, LoyaltyProgramSummary } from "@/features/loyalty/types";

/** Made-up cards of the art-direction preview (no account, no database). */
export const PREVIEW_MAIN_CARD_ID = "preview-noodles";

function tier(id: string, threshold: number, rewardLabel: string): LoyaltyProgramSummary {
  return {
    id,
    position: 1,
    threshold,
    rewardLabel,
    isActive: true,
    rewardImageUrl: null,
  };
}

function previewCard(
  cardId: string,
  restaurantName: string,
  stamps: number,
  program: LoyaltyProgramSummary,
): LoyaltyCardView {
  return {
    cardId,
    restaurantId: cardId,
    restaurantName,
    restaurantSlug: cardId,
    restaurantLogoUrl: null,
    restaurantCoverUrl: null,
    progress: computeCardProgress({ stamps, currentProgramId: program.id }, [program]),
  };
}

/** Two cards: the one the preview credits, and a 13 / 15 card (second row of segments). */
export function buildPreviewCards(mainStamps: number): LoyaltyCardView[] {
  return [
    previewCard(
      PREVIEW_MAIN_CARD_ID,
      "NouilleAtomique",
      mainStamps,
      tier("preview-tier-noodles", 10, "menu offert"),
    ),
    previewCard(
      "preview-donut",
      "Chez Pepe",
      13,
      tier("preview-tier-donut", 15, "donut"),
    ),
  ];
}
