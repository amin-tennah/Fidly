"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ProErrorProps {
  readonly reset: () => void;
}

export default function ProError({ reset }: ProErrorProps): ReactNode {
  return (
    <ErrorState
      title="Impossible de charger l'espace restaurateur"
      description="Un souci est survenu de notre côté. Réessayez dans un instant."
      onRetry={reset}
    />
  );
}
