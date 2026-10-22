"use server";

import { mapAuthErrorCode } from "@/features/auth/domain/map-auth-error";
import {
  sendEmailOtpSchema,
  type SendEmailOtpInput,
  verifyEmailOtpSchema,
  type VerifyEmailOtpInput,
} from "@/features/auth/schemas";
import { type ActionResult, err, ok } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Sends a 6-digit OTP code to the user's email address (creates the account
 * if it does not exist yet). See ADR-003.
 */
export async function sendEmailOtp(
  input: SendEmailOtpInput,
): Promise<ActionResult<{ readonly email: string }>> {
  const parsed = sendEmailOtpSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return err("VALIDATION_ERROR", firstIssue?.message);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return err(mapAuthErrorCode(error.code));
  }

  return ok({ email: parsed.data.email });
}

/**
 * Verifies a 6-digit email OTP code and establishes the session cookies.
 */
export async function verifyEmailOtp(
  input: VerifyEmailOtpInput,
): Promise<ActionResult<{ readonly userId: string }>> {
  const parsed = verifyEmailOtpSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return err("VALIDATION_ERROR", firstIssue?.message);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "email",
  });

  if (error || !data.user) {
    return err(mapAuthErrorCode(error?.code));
  }

  return ok({ userId: data.user.id });
}
