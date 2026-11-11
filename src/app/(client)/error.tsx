"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface ClientErrorProps {
  readonly retry: () => void;
}

export default function ClientError({ retry }: ClientErrorProps): ReactNode {
  return <ErrorState title="Impossible de charger tes cartes" onRetry={retry} />;
}
