"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface InvitationErrorProps {
  readonly reset: () => void;
}

export default function InvitationError({ reset }: InvitationErrorProps): ReactNode {
  return <ErrorState title="Impossible de charger tes invitations" onRetry={reset} />;
}
