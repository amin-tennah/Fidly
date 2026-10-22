import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildLoginPath,
  CLIENT_HOME_PATH,
  PRO_HOME_PATH,
  SignOutButton,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  listMyRestaurantMemberships,
} from "@/features/auth/queries/get-session-context";

export const metadata: Metadata = {
  title: "Espace Restaurateur",
};

function ProOverviewCard(): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Scanner & configuration (Phases 5 & 6)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Votre accès restaurateur est actif et protégé. La configuration de la fiche et
          des paliers sera livrée en Phase 5, et le scanner caisse en Phase 6.
        </p>
        <Link
          href={CLIENT_HOME_PATH}
          className="text-accent inline-block text-xs font-semibold underline-offset-4 hover:underline"
        >
          ← Voir mon espace client
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function ProHomePage(): Promise<ReactNode> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(PRO_HOME_PATH));
  }

  const memberships = await listMyRestaurantMemberships(user.id);
  const activeMembership = memberships[0];
  const roleLabel =
    activeMembership?.role === "owner" ? "Gérant (owner)" : "Équipier (staff)";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Espace Pro · Fidly
            </span>
            <SignOutButton variant="ghost" size="sm" />
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {activeMembership?.restaurantName ?? "Votre établissement"}
          </h1>
          <p className="text-muted-foreground text-xs">
            Rôle : <span className="font-semibold">{roleLabel}</span>
          </p>
        </header>
        <ProOverviewCard />
      </div>
      <footer className="text-muted-foreground text-center text-xs">
        Espace restaurateur Fidly · Phase 3
      </footer>
    </main>
  );
}
