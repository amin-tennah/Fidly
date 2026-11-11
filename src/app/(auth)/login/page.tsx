import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ScreenTitle } from "@/components/shared/screen-title";
import {
  GoogleSignInButton,
  LOGIN_ERROR_PARAM,
  LoginStepsBand,
  NEXT_PARAM,
  OtpLoginForm,
  sanitizeNextPath,
} from "@/features/auth";

export const metadata: Metadata = {
  title: "Connexion",
};

interface LoginPageProps {
  readonly searchParams: Promise<{
    readonly [NEXT_PARAM]?: string | string[];
    readonly [LOGIN_ERROR_PARAM]?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<ReactNode> {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(firstParam(params[NEXT_PARAM]));
  const hasError = Boolean(firstParam(params[LOGIN_ERROR_PARAM]));

  return (
    <div className="bg-cream">
      <main className="pt-safe-14 pb-safe-7 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-[22px] px-6">
        <BrandLogo tone="forest" width={230} className="mx-auto" />
        <LoginStepsBand />
        <ScreenTitle>Connecte-toi pour retrouver ta carte</ScreenTitle>
        {hasError ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            La connexion a échoué ou a été annulée. Réessaie.
          </p>
        ) : null}
        <GoogleSignInButton nextPath={nextPath} />
        <OtpLoginForm nextPath={nextPath} />
        <p className="text-muted-foreground mt-auto pt-4 text-center text-[13px]">
          Pas de mot de passe, pas d&apos;appli à télécharger.
        </p>
      </main>
    </div>
  );
}
