import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ComingSoonCard } from "@/components/shared/coming-soon-card";

export const metadata: Metadata = {
  title: "Logs",
};

export default function ProLogsPage(): ReactNode {
  return (
    <ComingSoonCard
      title="Journal des scans"
      description="Le journal en direct sera livré en Phase 7."
    />
  );
}
