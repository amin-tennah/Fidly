import Link from "next/link";
import type { ReactNode } from "react";
import {
  ADMIN_HOME_PATH,
  INVITATION_PATH,
  PRO_HOME_PATH,
} from "@/features/auth/constants";
import type {
  PendingRestaurantInvitation,
  RestaurantMembershipSummary,
} from "@/features/auth/types";

export interface ProAccessBannersProps {
  readonly invitations: readonly PendingRestaurantInvitation[];
  readonly memberships: readonly RestaurantMembershipSummary[];
  readonly isPlatformAdmin: boolean;
}

/** Shortcuts shown on the client home for restaurant staff, invited owners and platform admins. */
export function ProAccessBanners({
  invitations,
  memberships,
  isPlatformAdmin,
}: ProAccessBannersProps): ReactNode {
  const firstInvitation = invitations[0];
  const firstMembership = memberships[0];

  return (
    <>
      {firstInvitation ? (
        <Link
          href={INVITATION_PATH}
          className="block rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900"
        >
          Invitation restaurateur en attente ({firstInvitation.restaurantName}) → Accepter
        </Link>
      ) : null}
      {firstMembership ? (
        <Link
          href={PRO_HOME_PATH}
          className="text-accent inline-block text-xs font-semibold underline-offset-4 hover:underline"
        >
          Accéder à l&apos;espace restaurateur ({firstMembership.restaurantName}) →
        </Link>
      ) : null}
      {isPlatformAdmin ? (
        <Link
          href={ADMIN_HOME_PATH}
          className="text-accent inline-block text-xs font-semibold underline-offset-4 hover:underline"
        >
          Accéder au back-office Fidly →
        </Link>
      ) : null}
    </>
  );
}
