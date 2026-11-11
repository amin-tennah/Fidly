import { STANDALONE_MEDIA_QUERY } from "@/features/pwa/constants";
import { isIosDevice } from "@/features/pwa/domain/detect-platform";
import {
  readInstallDismissed,
  saveInstallDismissed,
} from "@/features/pwa/install-storage";

/**
 * What the browser says about the install state, as a small external store for
 * `useSyncExternalStore`. The snapshot is a bit mask, so it is stable between reads.
 */
const INSTALLED = 1;
const DISMISSED = 2;
const IOS = 4;

const listeners = new Set<() => void>();
let hasInstalledThisVisit = false;

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeInstallEnvironment(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** iOS Safari reports an installed app through `navigator.standalone`, not the media query. */
function isRunningInstalled(): boolean {
  const iosStandalone = "standalone" in navigator && navigator.standalone === true;
  return iosStandalone || window.matchMedia(STANDALONE_MEDIA_QUERY).matches;
}

export function readInstallEnvironment(): number {
  const isIos = isIosDevice({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints,
  });
  return (
    (hasInstalledThisVisit || isRunningInstalled() ? INSTALLED : 0) |
    (readInstallDismissed() ? DISMISSED : 0) |
    (isIos ? IOS : 0)
  );
}

/** Server snapshot: reads as installed, so nothing is rendered before hydration. */
export const SERVER_INSTALL_ENVIRONMENT = INSTALLED;

export function decodeInstallEnvironment(mask: number): {
  readonly isInstalled: boolean;
  readonly isDismissed: boolean;
  readonly isIos: boolean;
} {
  return {
    isInstalled: (mask & INSTALLED) !== 0,
    isDismissed: (mask & DISMISSED) !== 0,
    isIos: (mask & IOS) !== 0,
  };
}

export function markInstalled(): void {
  hasInstalledThisVisit = true;
  notify();
}

export function markDismissed(): void {
  saveInstallDismissed();
  notify();
}
