import { QrCode } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";

export function LoyaltyCardsEmptyState(): ReactNode {
  return (
    <EmptyState
      icon={QrCode}
      title="Aucune carte pour le moment"
      description="Fais-toi scanner lors de ton prochain repas : ta première carte apparaîtra ici."
    />
  );
}
