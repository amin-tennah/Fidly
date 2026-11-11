"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface OnboardingErrorProps {
  readonly retry: () => void;
}

export default function OnboardingError({ retry }: OnboardingErrorProps): ReactNode {
  return <ErrorState title="Impossible de charger cette page" onRetry={retry} />;
}
