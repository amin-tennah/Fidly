"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AdminErrorProps {
  readonly reset: () => void;
}

export default function AdminError({ reset }: AdminErrorProps): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <h1 className="text-lg font-semibold">Impossible de charger le back-office</h1>
      <Button type="button" onClick={reset}>
        Réessayer
      </Button>
    </main>
  );
}
