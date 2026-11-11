export { ClientHomeHeader } from "./components/client-home-header";
export { CustomerQrHero } from "./components/customer-qr-hero";
export { LoyaltyRealtimeSync } from "./components/loyalty-realtime-sync";
export { CardCelebrations } from "./components/card-celebrations";
export { CelebrationPreview } from "./components/celebration-preview";
export { CardBannerHeader } from "./components/card-banner-header";
export { LoyaltyHeroCard } from "./components/loyalty-hero-card";
export { NextTierBlock } from "./components/next-tier-block";
export { IntroSplash } from "./components/intro-splash";
export { HomeReadyMarker } from "./components/home-ready-marker";
export { LoyaltyCardsList } from "./components/loyalty-cards-list";
export { SegmentedProgress } from "./components/segmented-progress";

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
