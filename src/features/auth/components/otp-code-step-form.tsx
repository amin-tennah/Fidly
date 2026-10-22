"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OTP_LENGTH } from "@/features/auth/constants";
import { verifyEmailOtpSchema, type VerifyEmailOtpInput } from "@/features/auth/schemas";

export interface OtpCodeStepFormProps {
  readonly email: string;
  readonly isPending: boolean;
  readonly resendSecondsLeft: number;
  readonly onSubmitCode: (token: string) => void;
  readonly onResend: () => void;
  readonly onChangeEmail: () => void;
}

interface CodeFieldProps {
  readonly form: UseFormReturn<VerifyEmailOtpInput>;
  readonly isPending: boolean;
}

function CodeField({ form, isPending }: CodeFieldProps): ReactNode {
  return (
    <FormField
      control={form.control}
      name="token"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Code à {OTP_LENGTH} chiffres</FormLabel>
          <FormControl>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              placeholder="123456"
              className="text-center font-mono text-lg tracking-widest"
              disabled={isPending}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface CodeStepFooterProps {
  readonly isPending: boolean;
  readonly resendSecondsLeft: number;
  readonly onResend: () => void;
  readonly onChangeEmail: () => void;
}

function CodeStepFooter({
  isPending,
  resendSecondsLeft,
  onResend,
  onChangeEmail,
}: CodeStepFooterProps): ReactNode {
  const resendLabel =
    resendSecondsLeft > 0 ? `Renvoyer (${resendSecondsLeft} s)` : "Renvoyer le code";

  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={onChangeEmail}
      >
        Changer d&apos;email
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending || resendSecondsLeft > 0}
        onClick={onResend}
      >
        {resendLabel}
      </Button>
    </div>
  );
}

export function OtpCodeStepForm({
  email,
  isPending,
  resendSecondsLeft,
  onSubmitCode,
  onResend,
  onChangeEmail,
}: OtpCodeStepFormProps): ReactNode {
  const form = useForm<VerifyEmailOtpInput>({
    resolver: zodResolver(verifyEmailOtpSchema),
    defaultValues: { email, token: "" },
  });

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) =>
          void form.handleSubmit((values) => onSubmitCode(values.token))(e)
        }
      >
        <CodeField form={form} isPending={isPending} />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Vérification…" : "Valider le code"}
        </Button>
        <CodeStepFooter
          isPending={isPending}
          resendSecondsLeft={resendSecondsLeft}
          onResend={onResend}
          onChangeEmail={onChangeEmail}
        />
      </form>
    </Form>
  );
}
