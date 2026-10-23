"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useTransition } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
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
import { NativeSelect } from "@/components/ui/native-select";
import { updateRestaurantIdentity } from "@/features/restaurants/actions/update-restaurant-profile";
import {
  RESTAURANT_CATEGORY_LABELS,
  RESTAURANT_CATEGORY_VALUES,
  RESTAURANT_NAME_MAX_LENGTH,
} from "@/features/restaurants/constants";
import {
  restaurantIdentitySchema,
  type RestaurantIdentityInput,
} from "@/features/restaurants/schemas";

export interface RestaurantIdentityFormProps {
  readonly restaurantId: string;
  readonly initialValues: RestaurantIdentityInput;
  readonly onDone: () => void;
}

interface FieldsProps {
  readonly form: UseFormReturn<RestaurantIdentityInput>;
  readonly isPending: boolean;
}

function NameField({ form, isPending }: FieldsProps): ReactNode {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom de l&apos;établissement</FormLabel>
          <FormControl>
            <Input
              maxLength={RESTAURANT_NAME_MAX_LENGTH}
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

function CategoryField({ form, isPending }: FieldsProps): ReactNode {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Catégorie</FormLabel>
          <FormControl>
            <NativeSelect disabled={isPending} {...field}>
              {RESTAURANT_CATEGORY_VALUES.map((value) => (
                <option key={value} value={value}>
                  {RESTAURANT_CATEGORY_LABELS[value]}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function useIdentityForm(
  restaurantId: string,
  initialValues: RestaurantIdentityInput,
  onDone: () => void,
): {
  readonly form: UseFormReturn<RestaurantIdentityInput>;
  readonly isPending: boolean;
  readonly submit: (values: RestaurantIdentityInput) => void;
} {
  const [isPending, startTransition] = useTransition();
  const form = useForm<RestaurantIdentityInput>({
    resolver: zodResolver(restaurantIdentitySchema),
    defaultValues: initialValues,
  });

  const submit = (values: RestaurantIdentityInput): void => {
    startTransition(async () => {
      const res = await updateRestaurantIdentity({ restaurantId, ...values });
      if (res.ok) {
        toast.success("Informations enregistrées.");
        onDone();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return { form, isPending, submit };
}

/** Inline form for the name and category of the restaurant. */
export function RestaurantIdentityForm({
  restaurantId,
  initialValues,
  onDone,
}: RestaurantIdentityFormProps): ReactNode {
  const { form, isPending, submit } = useIdentityForm(
    restaurantId,
    initialValues,
    onDone,
  );

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-3"
        onSubmit={(e) => void form.handleSubmit(submit)(e)}
      >
        <NameField form={form} isPending={isPending} />
        <CategoryField form={form} isPending={isPending} />
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onDone}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
