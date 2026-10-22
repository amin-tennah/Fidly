import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GoogleSignInButton,
  LOGIN_ERROR_PARAM,
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
    <div className="mb-6 space-y-1 text-center">
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        Fidly · Zéro Friction
      </span>
      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        Accédez à vos cartes de fidélité
      </h1>
      <p className="text-muted-foreground text-sm">
        Connectez-vous en 1 tap avec Google ou avec un code reçu par email.
      </p>
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8">
      <LoginHero />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Connexion rapide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {hasError ? (
            <p role="alert" className="text-destructive text-xs font-medium">
              La connexion a échoué ou a été annulée. Veuillez réessayer.
            </p>
          ) : null}
          <GoogleSignInButton nextPath={nextPath} />
          <div className="relative flex items-center justify-center">
            <span className="border-border w-full border-t" />
            <span className="bg-card text-muted-foreground relative px-3 text-xs uppercase">
              ou par email
            </span>
          </div>
          <OtpLoginForm nextPath={nextPath} />
        </CardContent>
      </Card>
    </main>
  );
}
