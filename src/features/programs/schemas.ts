import { z } from "zod";
import {
  PROGRAM_THRESHOLD_MAX,
  REWARD_LABEL_MAX_LENGTH,
} from "@/features/programs/constants";

const idSchema = z.uuid("Identifiant invalide.");

export const programFieldsSchema = z.object({
  threshold: z
    .number("Saisissez un nombre de passages.")
    .int("Le seuil doit être un nombre entier.")
    .min(1, "Le seuil doit être d'au moins 1 passage.")
    .max(
      PROGRAM_THRESHOLD_MAX,
      `Le seuil ne peut pas dépasser ${PROGRAM_THRESHOLD_MAX}.`,
    ),
  rewardLabel: z
    .string()
    .trim()
    .min(1, "Décrivez la récompense.")
    .max(REWARD_LABEL_MAX_LENGTH, "Le libellé est trop long."),
});

export type ProgramFieldsInput = z.infer<typeof programFieldsSchema>;

export const createProgramSchema = programFieldsSchema.extend({ restaurantId: idSchema });
export type CreateProgramInput = z.infer<typeof createProgramSchema>;

export const updateProgramSchema = programFieldsSchema.extend({
  restaurantId: idSchema,
  programId: idSchema,
});
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;

export const setProgramActiveSchema = z.object({
  restaurantId: idSchema,
  programId: idSchema,
  isActive: z.boolean(),
});
export type SetProgramActiveInput = z.infer<typeof setProgramActiveSchema>;

export const reorderProgramsSchema = z.object({
  restaurantId: idSchema,
  programIds: z.array(idSchema).min(1).max(20),
});
export type ReorderProgramsInput = z.infer<typeof reorderProgramsSchema>;
