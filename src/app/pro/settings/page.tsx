import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ComingSoonCard } from "@/components/shared/coming-soon-card";

export const metadata: Metadata = {
  title: "Réglages",
};

export default function ProSettingsPage(): ReactNode {
  return (
    <ComingSoonCard
      title="Fiche et programmes"
      description="La configuration de l'établissement arrive avec les étapes 5.2 à 5.4."
    />
  );
}
