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
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="bg-gain text-gain-foreground inline-flex items-center rounded-full px-3 py-1 text-sm font-bold">
          Espace Pro · {roleLabel}
        </span>
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
          <h1 className="font-display text-foreground text-[28px] leading-[1.05] font-extrabold tracking-[-0.02em]">
            {active.restaurantName}
          </h1>
        )}
      </div>
    </header>
  );
}
