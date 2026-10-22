import "server-only";
import { cache } from "react";
import { computeCardProgress } from "@/features/loyalty/domain/compute-card-progress";
import type { LoyaltyCardView, LoyaltyProgramSummary } from "@/features/loyalty/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProgramsByRestaurant = ReadonlyMap<string, readonly LoyaltyProgramSummary[]>;

async function listProgramsByRestaurant(
  restaurantIds: readonly string[],
): Promise<ProgramsByRestaurant> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("loyalty_programs")
    .select("id, restaurant_id, position, threshold, reward_label, is_active")
    .in("restaurant_id", [...restaurantIds]);

  if (error) {
    throw new Error(`listProgramsByRestaurant failed: ${error.message}`);
  }

  const byRestaurant = new Map<string, LoyaltyProgramSummary[]>();
  for (const row of data) {
    const program: LoyaltyProgramSummary = {
      id: row.id,
      position: row.position,
      threshold: row.threshold,
      rewardLabel: row.reward_label,
      isActive: row.is_active,
    };
    byRestaurant.set(row.restaurant_id, [
      ...(byRestaurant.get(row.restaurant_id) ?? []),
      program,
    ]);
  }
  return byRestaurant;
}

/**
 * Lists the caller's loyalty cards (most recent visit first) with their computed
 * progression. Reads only: balances are written by RPCs (Phase 6). Throws on a
 * database error so the route `error.tsx` is displayed instead of an empty list.
 */
export const listMyLoyaltyCards = cache(
  async (userId: string): Promise<readonly LoyaltyCardView[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("loyalty_cards")
      .select("id, restaurant_id, current_program_id, stamps, restaurants ( name, slug )")
      .eq("user_id", userId)
      .order("last_visit_at", { ascending: false, nullsFirst: false });

    if (error) {
      throw new Error(`listMyLoyaltyCards failed: ${error.message}`);
    }
    if (data.length === 0) {
      return [];
    }

    const programs = await listProgramsByRestaurant(data.map((row) => row.restaurant_id));

    return data.flatMap((row) => {
      if (!row.restaurants) {
        return [];
      }
      const progress = computeCardProgress(
        { stamps: row.stamps, currentProgramId: row.current_program_id },
        programs.get(row.restaurant_id) ?? [],
      );
      return [
        {
          cardId: row.id,
          restaurantName: row.restaurants.name,
          restaurantSlug: row.restaurants.slug,
          progress,
        },
      ];
    });
  },
);
