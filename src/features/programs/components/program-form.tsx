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
import {
  PROGRAM_THRESHOLD_MAX,
  REWARD_LABEL_MAX_LENGTH,
} from "@/features/programs/constants";
import {
  programFieldsSchema,
  type ProgramFieldsInput,
} from "@/features/programs/schemas";

export interface ProgramFormProps {
  readonly initialValues: ProgramFieldsInput;
  readonly submitLabel: string;
  readonly isPending: boolean;
  readonly onSubmit: (values: ProgramFieldsInput) => void;
  readonly onCancel: () => void;
}

function ThresholdField({
  form,
}: {
  readonly form: UseFormReturn<ProgramFieldsInput>;
}): ReactNode {
  return (
    <FormField
      control={form.control}
      name="threshold"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre de passages</FormLabel>
          <FormControl>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={PROGRAM_THRESHOLD_MAX}
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function LabelField({
  form,
}: {
  readonly form: UseFormReturn<ProgramFieldsInput>;
}): ReactNode {
  return (
    <FormField
      control={form.control}
      name="rewardLabel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Récompense</FormLabel>
          <FormControl>
            <Input
              maxLength={REWARD_LABEL_MAX_LENGTH}
              placeholder="Ex. 1 dessert offert"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function ProgramForm({
  initialValues,
  submitLabel,
  isPending,
  onSubmit,
  onCancel,
}: ProgramFormProps): ReactNode {
  const form = useForm<ProgramFieldsInput>({
    resolver: zodResolver(programFieldsSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-3"
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
      >
        <ThresholdField form={form} />
        <LabelField form={form} />
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Enregistrement…" : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
