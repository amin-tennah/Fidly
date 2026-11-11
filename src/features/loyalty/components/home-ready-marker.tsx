"use client";

import { useEffect, type ReactNode } from "react";
import { setHomeReady } from "@/features/loyalty/hooks/home-ready-store";

/** Renders nothing: tells the intro splash that the home content is mounted. */
export function HomeReadyMarker(): ReactNode {
  useEffect(() => {
    setHomeReady(true);
    return () => setHomeReady(false);
  }, []);

  return null;
}
