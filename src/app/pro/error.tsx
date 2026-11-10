"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ProErrorProps {
  readonly retry: () => void;
}

export default function ProError({ retry }: ProErrorProps): ReactNode {
  return (
    <ErrorState
      title="Impossible de charger l'espace restaurateur"
      description="Un souci est survenu de notre côté. Réessayez dans un instant."
      onRetry={retry}
      layout="inline"
    />
  );
}
