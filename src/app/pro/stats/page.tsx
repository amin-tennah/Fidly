import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ComingSoonCard } from "@/components/shared/coming-soon-card";

export const metadata: Metadata = {
  title: "Statistiques",
};

export default function ProStatsPage(): ReactNode {
  return (
    <ComingSoonCard
      title="Statistiques"
      description="Le tableau de bord de retour sur investissement sera livré en Phase 10."
    />
  );
}
