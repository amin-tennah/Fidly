"use client";

import type { ReactNode } from "react";
import { Wordmark } from "@/components/shared/wordmark";
import { Button } from "@/components/ui/button";
import { useIntroSplash } from "@/features/loyalty/hooks/use-intro-splash";
import { cn } from "@/lib/utils";

/** Full-screen animated intro (05-DIRECTION-ARTISTIQUE §5.3), played once per app opening. */
export function IntroSplash(): ReactNode {
  const { phase, skip } = useIntroSplash();

  if (phase === "hidden") {
    return null;
  }
  return (
    <div
      role="status"
      aria-label="Bienvenue sur Rézone"
      className={cn(
        "bg-primary fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-6 shadow-[12px_0_32px_rgb(14_31_23/0.3)]",
        phase === "leaving" && "animate-slide-out",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        className="text-primary-foreground hover:text-primary-foreground absolute top-4 right-4 hover:bg-white/10"
        onClick={skip}
      >
        Passer
      </Button>
      <p className="animate-fade-in font-display text-primary-foreground text-xl font-bold [animation-delay:200ms]">
        Bienvenue sur
      </p>
      <Wordmark className="w-[min(78vw,320px)]" />
    </div>
  );
}
