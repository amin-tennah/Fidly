import "server-only";
import { cache } from "react";
import type { ProgramView } from "@/features/programs/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Lists every tier of a restaurant, active or not, in display order (RLS-enforced).
 * Throws on a database error so `error.tsx` is shown instead of an empty list.
 */
export const listRestaurantPrograms = cache(
  async (restaurantId: string): Promise<readonly ProgramView[]> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("loyalty_programs")
      .select("id, position, threshold, reward_label, is_active")
      .eq("restaurant_id", restaurantId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error("Unable to load the loyalty programs");
    }
    return data.map((row) => ({
      id: row.id,
      position: row.position,
      threshold: row.threshold,
      rewardLabel: row.reward_label,
      isActive: row.is_active,
    }));
  },
);
