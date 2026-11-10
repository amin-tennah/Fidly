"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface AdminErrorProps {
  readonly retry: () => void;
}

export default function AdminError({ retry }: AdminErrorProps): ReactNode {
  return (
    <ErrorState
      title="Impossible de charger le back-office"
      description="Un souci est survenu de notre côté. Réessayez dans un instant."
      onRetry={retry}
    />
  );
}
