"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const getSnapshot = (): boolean => document.visibilityState === "visible";
const getServerSnapshot = (): boolean => true;

/** False while the tab is in the background: the camera is released to save battery. */
export function usePageVisibility(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
