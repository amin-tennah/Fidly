"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { updateDisplayName } from "@/features/auth/actions/profile-and-invitation-actions";
import { DISPLAY_NAME_MAX_LENGTH } from "@/features/auth/constants";
import { sanitizeNextPath } from "@/features/auth/domain/redirects";
import {
  updateDisplayNameSchema,
  type UpdateDisplayNameInput,
} from "@/features/auth/schemas";

export interface OnboardingNameFormProps {
  readonly initialDisplayName: string;
  readonly nextPath: string;
}

interface DisplayNameFieldProps {
  readonly form: UseFormReturn<UpdateDisplayNameInput>;
  readonly isPending: boolean;
  readonly errorMessage: string | null;
}

function DisplayNameField({
  form,
  isPending,
  errorMessage,
}: DisplayNameFieldProps): ReactNode {
  return (
    <>
      <FormField
        control={form.control}
        name="displayName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prénom ou pseudonyme</FormLabel>
            <FormControl>
              <Input
                type="text"
                autoComplete="given-name"
                maxLength={DISPLAY_NAME_MAX_LENGTH}
                placeholder="Ex. Camille"
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {errorMessage ? (
        <p role="alert" className="text-destructive text-xs font-medium">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}

export function OnboardingNameForm({
  initialDisplayName,
  nextPath,
}: OnboardingNameFormProps): ReactNode {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateDisplayNameInput>({
    resolver: zodResolver(updateDisplayNameSchema),
    defaultValues: { displayName: initialDisplayName },
  });

  const handleSubmit = (values: UpdateDisplayNameInput): void => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await updateDisplayName(values);
      if (!res.ok) {
        setErrorMessage(res.error.message);
        return;
      }
      router.replace(sanitizeNextPath(nextPath));
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
      >
        <DisplayNameField form={form} isPending={isPending} errorMessage={errorMessage} />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Enregistrement…" : "Accéder à ma carte"}
        </Button>
      </form>
    </Form>
  );
}
