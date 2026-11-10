"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";

interface InvitationErrorProps {
  readonly retry: () => void;
}

export default function InvitationError({ retry }: InvitationErrorProps): ReactNode {
  return <ErrorState title="Impossible de charger tes invitations" onRetry={retry} />;
}
