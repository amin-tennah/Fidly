import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function HomePage(): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-4 py-8">
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Fidly · Zéro Friction
        </span>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Votre carte de fidélité universelle de quartier
        </h1>
        <p className="text-muted-foreground text-sm">
          Présentez votre QR code unique en caisse pour cumuler vos passages et débloquer
          vos récompenses en moins de 3 secondes.
        </p>
      </header>

      <Card aria-label="Aperçu du QR code client" className="my-6 items-center">
        <CardContent className="flex w-full flex-col items-center pt-2">
          <div className="border-border bg-muted/50 text-muted-foreground flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed text-center text-xs">
            QR code personnel
            <br />
            (Phase 4)
          </div>
          <p className="text-foreground mt-4 font-mono text-sm font-semibold tracking-widest">
            CODE : --- ---
          </p>
          <div className="mt-5 w-full space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span>Progression exemple</span>
              <span className="text-accent font-semibold">7 / 10 passages</span>
            </div>
            <Progress value={70} aria-label="Exemple de progression fidélité" />
          </div>
        </CardContent>
      </Card>

      <footer className="text-muted-foreground text-center text-xs">
        Socle technique Fidly · Phase 1
      </footer>
    </main>
  );
}
