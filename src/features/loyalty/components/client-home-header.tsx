import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
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
  readonly isPlatformAdmin: boolean;
}

function initialOf(displayName: string): string {
  return displayName.trim().charAt(0).toUpperCase();
}

export function ClientHomeHeader({
  displayName,
  invitations,
  memberships,
  isPlatformAdmin,
}: ClientHomeHeaderProps): ReactNode {
  return (
    <>
      <header className="bg-primary text-primary-foreground space-y-5 rounded-b-[28px] px-4 pt-5 pb-7">
        <div className="flex items-center justify-between gap-2">
          <BrandLogo tone="cream" width={104} />
          <SignOutButton
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:text-primary-foreground min-h-12 hover:bg-white/10"
          />
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="bg-gain text-gain-foreground font-display flex size-12 shrink-0 items-center justify-center rounded-full text-xl font-extrabold"
          >
            {initialOf(displayName)}
          </span>
          <h1 className="font-display truncate text-2xl font-extrabold tracking-tight">
            Salut {displayName}
          </h1>
        </div>
      </header>
      <div className="space-y-2 px-4">
        <ProAccessBanners
          invitations={invitations}
          memberships={memberships}
          isPlatformAdmin={isPlatformAdmin}
        />
      </div>
    </>
  );
}
