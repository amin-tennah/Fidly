import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChartColumn } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Statistiques",
};

export default function ProStatsPage(): ReactNode {
  return (
    <EmptyState
      icon={ChartColumn}
      title="Statistiques à venir"
      description="Vous retrouverez ici vos passages, vos clients fidèles et vos récompenses remises."
    />
  );
}
