export interface PendingInvitationView {
  readonly email: string;
  readonly expiresAt: string;
}

/** A restaurant as listed in the back-office. */
export interface AdminRestaurantRow {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly categoryLabel: string;
  readonly ownerNames: readonly string[];
  readonly pendingInvitations: readonly PendingInvitationView[];
}

export interface CreatedRestaurant {
  readonly restaurantId: string;
  readonly slug: string;
}
