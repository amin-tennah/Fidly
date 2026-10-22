import type { ReactNode } from "react";
import {
  type PendingRestaurantInvitation,
  ProAccessBanners,
  type RestaurantMembershipSummary,
  SignOutButton,
} from "@/features/auth";

export interface ClientHomeHeaderProps {
  readonly displayName: string;
  readonly invitations: readonly PendingRestaurantInvitation[];
  readonly memberships: readonly RestaurantMembershipSummary[];
}

export function ClientHomeHeader({
  displayName,
  invitations,
  memberships,
}: ClientHomeHeaderProps): ReactNode {
  return (
    <header className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Fidly · Zéro Friction
        </span>
        <SignOutButton variant="ghost" size="sm" />
      </div>
      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        Bonjour {displayName}
      </h1>
      <p className="text-muted-foreground text-sm">
        Présentez ce QR code en caisse : vos passages se cumulent automatiquement.
      </p>
      <ProAccessBanners invitations={invitations} memberships={memberships} />
    </header>
  );
}
