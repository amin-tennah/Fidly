import type { Enums } from "@/types/database.types";

export type RestaurantMemberRole = Enums<"restaurant_member_role">;

export interface UserProfileSummary {
  readonly id: string;
  readonly displayName: string | null;
  readonly qrToken: string;
  readonly shortCode: string;
}

export interface RestaurantMembershipSummary {
  readonly restaurantId: string;
  readonly restaurantName: string;
  readonly restaurantSlug: string;
  readonly role: RestaurantMemberRole;
}

export interface PendingRestaurantInvitation {
  readonly invitationId: string;
  readonly restaurantId: string;
  readonly restaurantName: string;
  readonly memberRole: RestaurantMemberRole;
  readonly expiresAt: string;
}
