"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface LoginErrorProps {
  readonly reset: () => void;
}

export default function LoginError({ reset }: LoginErrorProps): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <h1 className="text-lg font-semibold">
        Impossible de charger la page de connexion
      </h1>
      <p className="text-muted-foreground text-sm">
        Une erreur inattendue est survenue. Veuillez réessayer.
      </p>
      <Button type="button" onClick={reset}>
        Réessayer
      </Button>
    </main>
  );
}
