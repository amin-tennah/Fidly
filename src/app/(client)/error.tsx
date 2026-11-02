"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ClientErrorProps {
  readonly reset: () => void;
}

export default function ClientError({ reset }: ClientErrorProps): ReactNode {
  return <ErrorState title="Impossible de charger tes cartes" onRetry={reset} />;
}
