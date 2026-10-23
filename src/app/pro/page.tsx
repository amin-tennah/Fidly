import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ComingSoonCard } from "@/components/shared/coming-soon-card";

export const metadata: Metadata = {
  title: "Scanner",
};

export default function ProScannerPage(): ReactNode {
  return (
    <ComingSoonCard
      title="Scanner un client"
      description="Le scanner de caisse sera livré en Phase 6."
    />
  );
}
