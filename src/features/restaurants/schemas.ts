import { z } from "zod";
import {
  ADDRESS_MAX_LENGTH,
  DAY_KEYS,
  IMAGE_KINDS,
  MAX_SLOTS_PER_DAY,
  RESTAURANT_CATEGORY_VALUES,
  RESTAURANT_NAME_MAX_LENGTH,
} from "@/features/restaurants/constants";
import {
  isValidTime,
  validateDaySlots,
} from "@/features/restaurants/domain/opening-hours";
import { validateWeek } from "@/features/restaurants/domain/validate-week";

const restaurantIdSchema = z.uuid("Établissement invalide.");

export const selectRestaurantSchema = z.object({
  restaurantId: restaurantIdSchema,
});

export type SelectRestaurantInput = z.infer<typeof selectRestaurantSchema>;

export const restaurantIdentitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom est obligatoire.")
    .max(RESTAURANT_NAME_MAX_LENGTH, "Le nom est trop long."),
  category: z.enum(RESTAURANT_CATEGORY_VALUES, "Choisissez une catégorie."),
});

export type RestaurantIdentityInput = z.infer<typeof restaurantIdentitySchema>;

export const updateRestaurantIdentitySchema = restaurantIdentitySchema.extend({
  restaurantId: restaurantIdSchema,
});

export type UpdateRestaurantIdentityInput = z.infer<
  typeof updateRestaurantIdentitySchema
>;

const timeSchema = z.string().refine(isValidTime, "Heure invalide (HH:MM).");

const daySlotsSchema = z
  .array(z.object({ open: timeSchema, close: timeSchema }))
  .max(MAX_SLOTS_PER_DAY, `${MAX_SLOTS_PER_DAY} créneaux maximum par jour.`)
  .superRefine((slots, ctx) => {
    const message = validateDaySlots(slots);
    if (message) {
      ctx.addIssue({ code: "custom", message });
    }
  });

export const openingHoursSchema = z
  .partialRecord(z.enum(DAY_KEYS), daySlotsSchema)
  .superRefine((hours, ctx) => {
    const message = validateWeek(hours);
    if (message) {
      ctx.addIssue({ code: "custom", message });
    }
  });

export const updateOpeningHoursSchema = z.object({
  restaurantId: restaurantIdSchema,
  openingHours: openingHoursSchema,
});

export type UpdateOpeningHoursInput = z.infer<typeof updateOpeningHoursSchema>;

export const updateRestaurantAddressSchema = z.object({
  restaurantId: restaurantIdSchema,
  address: z.string().trim().min(1, "Adresse invalide.").max(ADDRESS_MAX_LENGTH),
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export type UpdateRestaurantAddressInput = z.infer<typeof updateRestaurantAddressSchema>;

export const searchAddressesSchema = z.object({
  query: z.string().trim().min(1).max(ADDRESS_MAX_LENGTH),
});

export type SearchAddressesInput = z.infer<typeof searchAddressesSchema>;

export const uploadImageFieldsSchema = z.object({
  restaurantId: restaurantIdSchema,
  kind: z.enum(IMAGE_KINDS),
});
