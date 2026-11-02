"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface LoginErrorProps {
  readonly reset: () => void;
}

export default function LoginError({ reset }: LoginErrorProps): ReactNode {
  return (
    <ErrorState title="Impossible de charger la page de connexion" onRetry={reset} />
  );
}
