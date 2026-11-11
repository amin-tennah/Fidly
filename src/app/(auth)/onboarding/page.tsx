import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Pill } from "@/components/shared/pill";
import { ScreenTitle } from "@/components/shared/screen-title";
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
  title: "Bienvenue sur Rézone",
};

interface OnboardingPageProps {
  readonly searchParams: Promise<{
    readonly [NEXT_PARAM]?: string | string[];
  }>;
}

function OnboardingHeader(): ReactNode {
  return (
    <header className="space-y-3">
      <Pill>Dernière étape · 5 secondes</Pill>
      <ScreenTitle>Comment t&apos;appelles-tu ?</ScreenTitle>
      <p className="text-muted-foreground text-base">
        Ton prénom (ou pseudo) permet au commerçant de te reconnaître en caisse. Aucun nom
        de famille n&apos;est demandé.
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
    <main className="pt-safe-8 pb-safe-8 mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-5">
      <div className="space-y-6">
        <OnboardingHeader />
        <OnboardingNameForm initialDisplayName={currentName} nextPath={nextPath} />
      </div>
      <footer className="flex justify-center pt-4">
        <SignOutButton variant="ghost" />
      </footer>
    </main>
  );
}
