"use client";

import { useEffect, type ReactNode } from "react";
import { SERVICE_WORKER_URL } from "@/lib/offline";

/**
 * Registers `public/sw.js` in production only (a worker in dev would serve stale files while
 * hot reloading). The build id in the URL makes every deployment a new worker, hence a new
 * cache (ADR-025).
 */
export function ServiceWorkerRegistrar(): ReactNode {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.register(SERVICE_WORKER_URL).catch(() => {
      // Intentionally ignored: without the worker the app only loses its offline page.
    });
  }, []);

  return null;
}
