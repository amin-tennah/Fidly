"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface AdminErrorProps {
  readonly reset: () => void;
}

export default function AdminError({ reset }: AdminErrorProps): ReactNode {
  return (
    <ErrorState
      title="Impossible de charger le back-office"
      description="Un souci est survenu de notre côté. Réessayez dans un instant."
      onRetry={reset}
    />
  );
}
