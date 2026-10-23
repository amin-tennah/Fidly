import type { ReactNode } from "react";
import { RestaurantAvatar } from "@/components/shared/restaurant-avatar";
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
    <header className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Espace Pro · {roleLabel}
        </span>
        <SignOutButton variant="ghost" size="sm" />
      </div>
      <div className="flex items-center gap-3">
        <RestaurantAvatar name={active.restaurantName} logoUrl={logoUrl} size="lg" />
        {memberships.length > 1 ? (
          <RestaurantSwitcher
            memberships={memberships}
            activeRestaurantId={active.restaurantId}
          />
        ) : (
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {active.restaurantName}
          </h1>
        )}
      </div>
    </header>
  );
}
