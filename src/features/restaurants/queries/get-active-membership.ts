import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import type { RestaurantMembershipSummary } from "@/features/auth";
import { listMyRestaurantMemberships } from "@/features/auth/queries/get-session-context";
import { ACTIVE_RESTAURANT_COOKIE } from "@/features/restaurants/constants";
import { resolveActiveMembership } from "@/features/restaurants/domain/resolve-active-membership";

/**
 * Membership shown in the pro space. The cookie is only a preference: it is always
 * checked against the user's real memberships (RLS-filtered), never trusted.
 */
export const getActiveMembership = cache(
  async (userId: string): Promise<RestaurantMembershipSummary | null> => {
    const [memberships, cookieStore] = await Promise.all([
      listMyRestaurantMemberships(userId),
      cookies(),
    ]);
    const preferred = cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value;
    return resolveActiveMembership(memberships, preferred);
  },
);
