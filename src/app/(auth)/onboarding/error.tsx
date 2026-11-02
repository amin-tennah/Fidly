"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface OnboardingErrorProps {
  readonly reset: () => void;
}

export default function OnboardingError({ reset }: OnboardingErrorProps): ReactNode {
  return <ErrorState title="Impossible de charger cette page" onRetry={reset} />;
}
