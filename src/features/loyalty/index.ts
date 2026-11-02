export { ClientHomeHeader } from "./components/client-home-header";
export { CustomerQrHero } from "./components/customer-qr-hero";
export { LoyaltyRealtimeSync } from "./components/loyalty-realtime-sync";
export { LoyaltyCardsList } from "./components/loyalty-cards-list";

export { computeCardProgress } from "./domain/compute-card-progress";
export { getCardHue } from "./domain/card-hue";
export { describeCardMessage } from "./domain/card-message";
export { formatShortCode } from "./domain/format-short-code";

export type {
  CardProgress,
  LoyaltyCardState,
  LoyaltyCardView,
  LoyaltyProgramSummary,
} from "./types";
