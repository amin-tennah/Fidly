import type { RestaurantMembershipSummary } from "@/features/auth";

/**
 * Picks the membership the pro space should display: the remembered one when the
 * user still belongs to it, otherwise the oldest membership. `null` without any.
 */
export function resolveActiveMembership(
  memberships: readonly RestaurantMembershipSummary[],
  preferredRestaurantId: string | null | undefined,
): RestaurantMembershipSummary | null {
  const preferred = memberships.find(
    (membership) => membership.restaurantId === preferredRestaurantId,
  );
  return preferred ?? memberships[0] ?? null;
}
