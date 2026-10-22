import { z } from "zod";
import { DISPLAY_NAME_MAX_LENGTH, OTP_LENGTH } from "@/features/auth/constants";

export const sendEmailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Veuillez saisir une adresse email valide."),
});

export type SendEmailOtpInput = z.infer<typeof sendEmailOtpSchema>;

export const verifyEmailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Veuillez saisir une adresse email valide."),
  token: z
    .string()
    .trim()
    .regex(
      new RegExp(`^\\d{${OTP_LENGTH}}$`),
      `Le code doit contenir exactement ${OTP_LENGTH} chiffres.`,
    ),
});

export type VerifyEmailOtpInput = z.infer<typeof verifyEmailOtpSchema>;

export const updateDisplayNameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Veuillez saisir votre prénom ou pseudonyme.")
    .max(DISPLAY_NAME_MAX_LENGTH, `Maximum ${DISPLAY_NAME_MAX_LENGTH} caractères.`),
});

export type UpdateDisplayNameInput = z.infer<typeof updateDisplayNameSchema>;

export const acceptInvitationSchema = z.object({
  invitationId: z.string().uuid("Identifiant d'invitation invalide."),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
