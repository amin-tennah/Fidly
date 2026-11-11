"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  decideInstallBanner,
  type InstallBannerMode,
} from "@/features/pwa/domain/decide-install-banner";
import {
  decodeInstallEnvironment,
  markDismissed,
  markInstalled,
  readInstallEnvironment,
  SERVER_INSTALL_ENVIRONMENT,
  subscribeInstallEnvironment,
} from "@/features/pwa/install-environment-store";

/** Chromium's install prompt event, absent from the DOM typings. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isInstallPromptEvent(event: Event): event is InstallPromptEvent {
  return "prompt" in event && typeof event.prompt === "function";
}

export interface UseInstallBannerReturn {
  readonly mode: InstallBannerMode;
  readonly install: () => Promise<void>;
  readonly dismiss: () => void;
}

/** Keeps the browser's install prompt (Android Chrome) and reports a finished install. */
function useInstallPrompt(): readonly [
  InstallPromptEvent | null,
  (value: InstallPromptEvent | null) => void,
] {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const handlePrompt = (event: Event): void => {
      if (isInstallPromptEvent(event)) {
        event.preventDefault();
        setPrompt(event);
      }
    };
    const handleInstalled = (): void => {
      setPrompt(null);
      markInstalled();
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  return [prompt, setPrompt];
}

/** Browser-side state behind the install banner (roadmap 8.3). Hidden until hydrated. */
export function useInstallBanner(hasFirstVisit: boolean): UseInstallBannerReturn {
  const mask = useSyncExternalStore(
    subscribeInstallEnvironment,
    readInstallEnvironment,
    () => SERVER_INSTALL_ENVIRONMENT,
  );
  const [prompt, setPrompt] = useInstallPrompt();

  const install = useCallback(async (): Promise<void> => {
    if (!prompt) {
      return;
    }
    await prompt.prompt();
    await prompt.userChoice;
    // The event is single-use. A refusal is not stored: the banner returns on the next visit.
    setPrompt(null);
  }, [prompt, setPrompt]);

  const mode = decideInstallBanner({
    ...decodeInstallEnvironment(mask),
    hasFirstVisit,
    canPrompt: prompt !== null,
  });
  return { mode, install, dismiss: markDismissed };
}
