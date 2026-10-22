import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function LoyaltyCardsEmptyState(): ReactNode {
  return (
    <Card className="border-dashed">
      <CardContent className="space-y-1 text-center">
        <p className="text-foreground text-sm font-semibold">
          Aucune carte pour le moment
        </p>
        <p className="text-muted-foreground text-sm">
          Faites-vous scanner lors de votre prochain repas : votre première carte
          apparaîtra ici.
        </p>
      </CardContent>
    </Card>
  );
}
