"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AUTH_CALLBACK_PATH, NEXT_PARAM } from "@/features/auth/constants";
import { sanitizeNextPath } from "@/features/auth/domain/redirects";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface GoogleSignInButtonProps {
  readonly nextPath: string;
}

function buildOAuthRedirectUrl(origin: string, nextPath: string): string {
  const safeNext = sanitizeNextPath(nextPath);
  const callbackUrl = new URL(AUTH_CALLBACK_PATH, origin);
  if (safeNext !== "/") {
    callbackUrl.searchParams.set(NEXT_PARAM, safeNext);
  }
  return callbackUrl.toString();
}

export function GoogleSignInButton({ nextPath }: GoogleSignInButtonProps): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    const redirectTo = buildOAuthRedirectUrl(window.location.origin, nextPath);
    const { error } = await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setErrorMessage(
        "Impossible de démarrer la connexion Google. Utilisez le code par email.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={isLoading}
        onClick={() => void handleClick()}
      >
        {isLoading ? "Redirection vers Google…" : "Continuer avec Google"}
      </Button>
      {errorMessage ? (
        <p role="alert" className="text-destructive text-xs font-medium">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
