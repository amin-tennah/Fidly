import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildLoginPath,
  NEXT_PARAM,
  ONBOARDING_PATH,
  OnboardingNameForm,
  sanitizeNextPath,
  SignOutButton,
} from "@/features/auth";
import {
  getAuthenticatedUser,
  getMyProfile,
} from "@/features/auth/queries/get-session-context";

export const metadata: Metadata = {
  title: "Bienvenue sur Fidly",
};

interface OnboardingPageProps {
  readonly searchParams: Promise<{
    readonly [NEXT_PARAM]?: string | string[];
  }>;
}

function OnboardingHeader(): ReactNode {
  return (
    <header className="space-y-1">
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        Étape finale · 5 secondes
      </span>
      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        Comment vous appelez-vous ?
      </h1>
      <p className="text-muted-foreground text-sm">
        Votre prénom (ou pseudonyme) permet au commerçant de vous reconnaître en caisse.
        Aucun nom de famille n&apos;est demandé.
      </p>
    </header>
  );
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps): Promise<ReactNode> {
  const params = await searchParams;
  const rawNext = Array.isArray(params[NEXT_PARAM])
    ? params[NEXT_PARAM][0]
    : params[NEXT_PARAM];
  const nextPath = sanitizeNextPath(rawNext);

  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(buildLoginPath(ONBOARDING_PATH));
  }

  const profile = await getMyProfile(user.id);
  const currentName = profile?.displayName?.trim() ?? "";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <div className="space-y-6">
        <OnboardingHeader />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Votre prénom en caisse</CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingNameForm initialDisplayName={currentName} nextPath={nextPath} />
          </CardContent>
        </Card>
      </div>
      <footer className="flex justify-center pt-4">
        <SignOutButton variant="ghost" />
      </footer>
    </main>
  );
}
