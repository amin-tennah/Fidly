import type { ReactNode } from "react";
import { FormScreenSkeleton } from "@/components/shared/form-screen-skeleton";

const ONBOARDING_CARD_HEIGHT_PX = 232;

export default function OnboardingLoading(): ReactNode {
  return <FormScreenSkeleton cardHeight={ONBOARDING_CARD_HEIGHT_PX} />;
}
