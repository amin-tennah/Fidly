import "server-only";
import type { User } from "@supabase/supabase-js";
import { cache } from "react";
import type {
  PendingRestaurantInvitation,
  RestaurantMembershipSummary,
  UserProfileSummary,
} from "@/features/auth/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Every reader below is wrapped in React `cache()`: layouts and pages of the same
 * request share one Supabase round-trip instead of repeating it.
 */

/**
 * Returns the authenticated user verified by Supabase Auth (`getUser()`),
 * or `null` when no valid session exists. Never relies on `getSession()`.
 */
export const getAuthenticatedUser = cache(async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return data.user;
});

/** Reads the current user's profile row (selected columns only, RLS-enforced). */
export const getMyProfile = cache(
  async (userId: string): Promise<UserProfileSummary | null> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, qr_token, short_code")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      displayName: data.display_name,
      qrToken: data.qr_token,
      shortCode: data.short_code,
    };
  },
);

/** Lists restaurant memberships (`owner` / `staff`), oldest first, for the given user. */
export const listMyRestaurantMemberships = cache(
  async (userId: string): Promise<readonly RestaurantMembershipSummary[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("restaurant_members")
      .select("restaurant_id, role, created_at, restaurants ( name, slug )")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.flatMap((row) => {
      const restaurant = row.restaurants;
      if (!restaurant) {
        return [];
      }
      return [
        {
          restaurantId: row.restaurant_id,
          restaurantName: restaurant.name,
          restaurantSlug: restaurant.slug,
          role: row.role,
        },
      ];
    });
  },
);

/** Checks whether the given user is a platform administrator (`platform_admins`). */
export const isUserPlatformAdmin = cache(async (userId: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return !error && data !== null;
});

/** Lists valid pending restaurant invitations for the caller's verified email (RPC). */
export const listMyPendingInvitations = cache(
  async (): Promise<readonly PendingRestaurantInvitation[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("list_my_pending_invitations");

    if (error || !data) {
      return [];
    }

    return data.map((row) => ({
      invitationId: row.invitation_id,
      restaurantId: row.restaurant_id,
      restaurantName: row.restaurant_name,
      memberRole: row.member_role,
      expiresAt: row.expires_at,
    }));
  },
);
