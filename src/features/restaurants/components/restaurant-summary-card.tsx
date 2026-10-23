import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RESTAURANT_CATEGORY_LABELS } from "@/features/restaurants/constants";
import type { RestaurantProfile } from "@/features/restaurants/types";

export interface RestaurantSummaryCardProps {
  readonly profile: RestaurantProfile;
}

/** Read-only view shown to `staff`: only the owner can edit the profile (UI and RLS). */
export function RestaurantSummaryCard({
  profile,
}: RestaurantSummaryCardProps): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{profile.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>{RESTAURANT_CATEGORY_LABELS[profile.category]}</p>
        <p className="text-muted-foreground">
          {profile.address ?? "Adresse non renseignée"}
        </p>
        <p className="text-muted-foreground text-xs">
          Seul le gérant peut modifier la fiche de l&apos;établissement.
        </p>
      </CardContent>
    </Card>
  );
}
