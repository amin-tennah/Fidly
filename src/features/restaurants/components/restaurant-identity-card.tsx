"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useTransition } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export interface RestaurantIdentityCardProps {
  readonly restaurantId: string;
  readonly initialValues: RestaurantIdentityInput;
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
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return { form, isPending, submit };
}

export function RestaurantIdentityCard({
  restaurantId,
  initialValues,
}: RestaurantIdentityCardProps): ReactNode {
  const { form, isPending, submit } = useIdentityForm(restaurantId, initialValues);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Votre établissement</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            noValidate
            className="space-y-4"
            onSubmit={(e) => void form.handleSubmit(submit)(e)}
          >
            <NameField form={form} isPending={isPending} />
            <CategoryField form={form} isPending={isPending} />
            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
