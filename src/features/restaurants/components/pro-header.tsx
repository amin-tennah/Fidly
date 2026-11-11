import type { ReactNode } from "react";
import { Pill } from "@/components/shared/pill";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
import { ScreenTitle } from "@/components/shared/screen-title";
import { SignOutButton, type RestaurantMembershipSummary } from "@/features/auth";
import { RestaurantSwitcher } from "./restaurant-switcher";

export interface ProHeaderProps {
  readonly memberships: readonly RestaurantMembershipSummary[];
  readonly active: RestaurantMembershipSummary;
  readonly logoUrl: string | null;
}

export function ProHeader({ memberships, active, logoUrl }: ProHeaderProps): ReactNode {
  const roleLabel = active.role === "owner" ? "Gérant" : "Équipier";

  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Pill>Espace Pro · {roleLabel}</Pill>
        <SignOutButton
          variant="ghost"
          size="sm"
          className="min-h-12 text-sm font-extrabold"
        />
      </div>
      <div className="flex items-center gap-3">
        <RestaurantAvatar name={active.restaurantName} logoUrl={logoUrl} size="lg" />
        {memberships.length > 1 ? (
          <RestaurantSwitcher
            memberships={memberships}
            activeRestaurantId={active.restaurantId}
          />
        ) : (
          <ScreenTitle>{active.restaurantName}</ScreenTitle>
        )}
      </div>
    </header>
  );
}
