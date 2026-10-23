import { z } from "zod";
import {
  RESTAURANT_CATEGORY_VALUES,
  RESTAURANT_NAME_MAX_LENGTH,
} from "@/lib/restaurant-fields";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Veuillez saisir une adresse email valide.");

export const createRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom est obligatoire.")
    .max(RESTAURANT_NAME_MAX_LENGTH, "Le nom est trop long."),
  category: z.enum(RESTAURANT_CATEGORY_VALUES, "Choisissez une catégorie."),
  ownerEmail: emailSchema,
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export const inviteOwnerSchema = z.object({
  restaurantId: z.uuid("Établissement invalide."),
  email: emailSchema,
});

export type InviteOwnerInput = z.infer<typeof inviteOwnerSchema>;
