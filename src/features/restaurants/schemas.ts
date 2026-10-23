import { z } from "zod";

export const selectRestaurantSchema = z.object({
  restaurantId: z.uuid("Établissement invalide."),
});

export type SelectRestaurantInput = z.infer<typeof selectRestaurantSchema>;
