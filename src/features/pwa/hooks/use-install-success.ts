"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readInstallCelebrated,
  saveInstallCelebrated,
} from "@/features/pwa/install-storage";

export interface UseInstallSuccessReturn {
  readonly isVisible: boolean;
  readonly dismiss: () => void;
}

/**
 * State of the "installed" celebration (06-DA-ITERATION-2 §5), independent from the install
 * banner, which hides as soon as the app is installed. It only starts on the browser's
 * `appinstalled` event (Chromium): never on the click on "Installer", and never on iOS,
 * where Safari does not report an installation. Acknowledged once, then never shown again.
 */
export function useInstallSuccess(): UseInstallSuccessReturn {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleInstalled = (): void => {
      if (!readInstallCelebrated()) {
        setIsVisible(true);
      }
    };
    window.addEventListener("appinstalled", handleInstalled);
    return () => window.removeEventListener("appinstalled", handleInstalled);
  }, []);

  const dismiss = useCallback((): void => {
    saveInstallCelebrated();
    setIsVisible(false);
  }, []);

  return { isVisible, dismiss };
}
