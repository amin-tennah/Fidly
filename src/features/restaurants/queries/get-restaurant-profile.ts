import "server-only";
import { cache } from "react";
import { openingHoursSchema } from "@/features/restaurants/schemas";
import type { RestaurantProfile } from "@/features/restaurants/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Reads the editable profile of a restaurant (RLS-enforced). Throws on a database
 * error so `error.tsx` is shown; returns `null` when the row is not visible.
 */
export const getRestaurantProfile = cache(
  async (restaurantId: string): Promise<RestaurantProfile | null> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("restaurants")
      .select("id, name, category, address, opening_hours")
      .eq("id", restaurantId)
      .maybeSingle();

    if (error) {
      throw new Error("Unable to load the restaurant profile");
    }
    if (!data) {
      return null;
    }

    const hours = openingHoursSchema.safeParse(data.opening_hours);
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      address: data.address,
      openingHours: hours.success ? hours.data : {},
    };
  },
);
