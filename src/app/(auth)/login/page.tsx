import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Card, CardContent } from "@/components/ui/card";
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

function LoginHero(): ReactNode {
  return (
    <div className="mb-6 space-y-5 text-center">
      <BrandLogo tone="forest" width={200} className="mx-auto" />
      <LoginStepsBand />
      <h1 className="font-display text-foreground text-2xl font-extrabold tracking-tight">
        Connecte-toi pour retrouver ta carte
      </h1>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<ReactNode> {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(firstParam(params[NEXT_PARAM]));
  const hasError = Boolean(firstParam(params[LOGIN_ERROR_PARAM]));

  return (
    <div className="bg-cream">
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8">
        <LoginHero />
        <Card>
          <CardContent className="space-y-5">
            {hasError ? (
              <p role="alert" className="text-destructive text-xs font-medium">
                La connexion a échoué ou a été annulée. Réessaie.
              </p>
            ) : null}
            <GoogleSignInButton nextPath={nextPath} />
            <div className="relative flex items-center justify-center">
              <span className="border-border w-full border-t-2" />
              <span className="bg-card text-muted-foreground relative px-3 text-xs uppercase">
                ou avec ton email
              </span>
            </div>
            <OtpLoginForm nextPath={nextPath} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
