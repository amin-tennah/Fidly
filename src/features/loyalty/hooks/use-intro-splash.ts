"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CLIENT_HOME_PATH, LOGIN_PATH, ONBOARDING_PATH } from "@/features/auth";
import { INTRO_EXIT_DURATION_MS } from "@/features/loyalty/constants";
import {
  initialIntroPhase,
  introPhaseAt,
  shouldIntroLeave,
  type IntroLocation,
  type IntroPhase,
} from "@/features/loyalty/domain/intro-phase";
import {
  getHomeReady,
  getServerHomeReady,
  subscribeHomeReady,
} from "@/features/loyalty/hooks/home-ready-store";
import { useIntroClock } from "@/features/loyalty/hooks/use-intro-clock";

const AUTH_PATHS: readonly string[] = [LOGIN_PATH, ONBOARDING_PATH];

function locate(pathname: string): IntroLocation {
  if (pathname === CLIENT_HOME_PATH) {
    return "home";
  }
  return AUTH_PATHS.includes(pathname) ? "auth" : "other";
}

/**
 * Drives the intro mounted in the root layout: it plays once per app opening (or sign-in),
 * on top of the home while it loads. It stays at least the time the stamp needs to land,
 * then leaves as soon as the home is ready, and never later than the ceiling.
 */
export function useIntroSplash(readElapsedMs: () => number): {
  phase: IntroPhase;
  skip: () => void;
} {
  const location = locate(usePathname());
  const [phase, setPhase] = useState<IntroPhase>(() => initialIntroPhase(location));
  const isHomeReady = useSyncExternalStore(
    subscribeHomeReady,
    getHomeReady,
    getServerHomeReady,
  );
  const clock = useIntroClock(phase === "visible", readElapsedMs);

  // Derived transitions, applied during render (no effect needed).
  const located = introPhaseAt(phase, location);
  const next =
    located === "visible" && shouldIntroLeave(clock, isHomeReady) ? "leaving" : located;
  if (next !== phase) {
    setPhase(next);
  }

  useEffect(() => {
    if (phase !== "leaving") {
      return;
    }
    const timer = window.setTimeout(() => setPhase("hidden"), INTRO_EXIT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return { phase, skip: () => setPhase("leaving") };
}
