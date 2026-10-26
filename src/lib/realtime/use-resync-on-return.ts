"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onResync` when the tab becomes visible again and when the network comes back:
 * iOS suspends WebSockets in the background, Realtime is only a freshness bonus.
 */
export function useResyncOnReturn(onResync: () => void): void {
  const onResyncRef = useRef(onResync);
  useEffect(() => {
    onResyncRef.current = onResync;
  });

  useEffect(() => {
    const handleVisibility = (): void => {
      if (document.visibilityState === "visible") {
        onResyncRef.current();
      }
    };
    const handleOnline = (): void => onResyncRef.current();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleOnline);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
