import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminRestaurantList, CreateRestaurantForm } from "@/features/admin";
import { listAdminRestaurants } from "@/features/admin/queries/list-admin-restaurants";
import { CLIENT_HOME_PATH, SignOutButton } from "@/features/auth";
import { Card } from "@/components/ui/card";
import { getPublicEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Administration Rézone",
};

/** Back-office: create a restaurant, invite its owner, print the easel QR (Step 5.5). */
export default async function AdminHomePage(): Promise<ReactNode> {
  const restaurants = await listAdminRestaurants();
  const { NEXT_PUBLIC_APP_URL } = getPublicEnv();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Super-Admin · Rézone
          </span>
          <SignOutButton variant="ghost" size="sm" />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Back-office Rézone
        </h1>
      </header>
      <Card>
        <h2 className="text-base font-semibold">Nouveau restaurant</h2>
        <CreateRestaurantForm />
      </Card>
      <section aria-label="Restaurants" className="space-y-3">
        <h2 className="text-base font-semibold">Restaurants ({restaurants.length})</h2>
        <AdminRestaurantList restaurants={restaurants} appUrl={NEXT_PUBLIC_APP_URL} />
      </section>
      <Link
        href={CLIENT_HOME_PATH}
        className="text-accent text-xs font-semibold underline-offset-4 hover:underline"
      >
        ← Retour à l&apos;accueil client
      </Link>
    </main>
  );
}
