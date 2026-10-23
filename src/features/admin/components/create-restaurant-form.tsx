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
import { createRestaurant } from "@/features/admin/actions/admin-actions";
import {
  createRestaurantSchema,
  type CreateRestaurantInput,
} from "@/features/admin/schemas";
import {
  RESTAURANT_CATEGORY_LABELS,
  RESTAURANT_CATEGORY_VALUES,
  RESTAURANT_NAME_MAX_LENGTH,
} from "@/lib/restaurant-fields";

const EMPTY_VALUES: CreateRestaurantInput = {
  name: "",
  category: "other",
  ownerEmail: "",
};

type FormApi = UseFormReturn<CreateRestaurantInput>;

function NameAndEmailFields({ form }: { readonly form: FormApi }): ReactNode {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du restaurant</FormLabel>
            <FormControl>
              <Input maxLength={RESTAURANT_NAME_MAX_LENGTH} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ownerEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email du gérant</FormLabel>
            <FormControl>
              <Input type="email" autoComplete="off" inputMode="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function CategoryField({ form }: { readonly form: FormApi }): ReactNode {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Catégorie</FormLabel>
          <FormControl>
            <NativeSelect {...field}>
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

/** Creates a restaurant and invites its owner by email (the invitation is the only link). */
export function CreateRestaurantForm(): ReactNode {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateRestaurantInput>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: EMPTY_VALUES,
  });

  const submit = (values: CreateRestaurantInput): void => {
    startTransition(async () => {
      const res = await createRestaurant(values);
      if (res.ok) {
        toast.success(
          `« ${values.name} » créé. Le gérant doit se connecter avec ${values.ownerEmail}.`,
        );
        form.reset(EMPTY_VALUES);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-3"
        onSubmit={(e) => void form.handleSubmit(submit)(e)}
      >
        <NameAndEmailFields form={form} />
        <CategoryField form={form} />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Création…" : "Créer et inviter le gérant"}
        </Button>
      </form>
    </Form>
  );
}
