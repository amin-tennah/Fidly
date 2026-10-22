import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLIENT_HOME_PATH, SignOutButton } from "@/features/auth";

export const metadata: Metadata = {
  title: "Administration Fidly",
};

function AdminOverviewCard(): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Création de restaurants & invitations (Phase 5.5)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          L&apos;accès super-administrateur (`platform_admins`) est vérifié.
          L&apos;interface de création d&apos;établissement et d&apos;émission
          d&apos;invitations gérants sera livrée à l&apos;étape 5.5.
        </p>
        <Link
          href={CLIENT_HOME_PATH}
          className="text-accent inline-block text-xs font-semibold underline-offset-4 hover:underline"
        >
          ← Retour à l&apos;accueil client
        </Link>
      </CardContent>
    </Card>
  );
}

export default function AdminHomePage(): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Super-Admin · Fidly
            </span>
            <SignOutButton variant="ghost" size="sm" />
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Back-office Fidly
          </h1>
        </header>
        <AdminOverviewCard />
      </div>
      <footer className="text-muted-foreground text-center text-xs">
        Administration Fidly · Phase 3
      </footer>
    </main>
  );
}
