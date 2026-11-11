"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { Wordmark } from "@/components/shared/wordmark";
import { Button } from "@/components/ui/button";
import { useIntroSplash } from "@/features/loyalty/hooks/use-intro-splash";
import { cn } from "@/lib/utils";

/**
 * Full-screen animated intro (05-DIRECTION-ARTISTIQUE §5.3). Mounted in the root layout so
 * that it covers the home while it loads; it then slides away and reveals it.
 */
export function IntroSplash(): ReactNode {
  const layerRef = useRef<HTMLDivElement>(null);
  // Time already spent animating, read from the rendered animations themselves (a finished
  // one stops counting, hence the longest).
  const readElapsedMs = useCallback((): number => {
    const animations = layerRef.current?.getAnimations({ subtree: true }) ?? [];
    return Math.max(0, ...animations.map((animation) => Number(animation.currentTime)));
  }, []);
  const { phase, skip } = useIntroSplash(readElapsedMs);

  if (phase !== "visible" && phase !== "leaving") {
    return null;
  }
  return (
    <div
      ref={layerRef}
      role="status"
      aria-label="Bienvenue sur Rézone"
      className={cn(
        "bg-primary shadow-intro fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-6",
        phase === "leaving" && "animate-slide-out",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        className="text-primary-foreground hover:text-primary-foreground top-safe-4 absolute right-4 hover:bg-white/10"
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
