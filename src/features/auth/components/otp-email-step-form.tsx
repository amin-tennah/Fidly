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
import { sendEmailOtpSchema, type SendEmailOtpInput } from "@/features/auth/schemas";

export interface OtpEmailStepFormProps {
  readonly defaultEmail: string;
  readonly isPending: boolean;
  readonly onSubmitEmail: (email: string) => void;
}

interface EmailFieldProps {
  readonly form: UseFormReturn<SendEmailOtpInput>;
  readonly isPending: boolean;
}

function EmailField({ form, isPending }: EmailFieldProps): ReactNode {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Adresse email</FormLabel>
          <FormControl>
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
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

export function OtpEmailStepForm({
  defaultEmail,
  isPending,
  onSubmitEmail,
}: OtpEmailStepFormProps): ReactNode {
  const form = useForm<SendEmailOtpInput>({
    resolver: zodResolver(sendEmailOtpSchema),
    defaultValues: { email: defaultEmail },
  });

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) =>
          void form.handleSubmit((values) => onSubmitEmail(values.email))(e)
        }
      >
        <EmailField form={form} isPending={isPending} />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Envoi du code…" : "Recevoir un code à 6 chiffres"}
        </Button>
      </form>
    </Form>
  );
}
