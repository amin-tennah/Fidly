import {
  INSTALL_CELEBRATED_STORAGE_KEY,
  INSTALL_DISMISSED_STORAGE_KEY,
} from "@/features/pwa/constants";

/**
 * The banner is only hidden for the current browser session (iOS "J'ai compris"), never for
 * good: someone who uninstalled the app must be offered it again. Storage can throw
 * (private mode, blocked site data): the banner then simply comes back.
 */
export function readInstallDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(INSTALL_DISMISSED_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveInstallDismissed(): void {
  try {
    window.sessionStorage.setItem(INSTALL_DISMISSED_STORAGE_KEY, "1");
  } catch {
    // Intentionally ignored: without storage the refusal lasts until the page closes.
  }
}

/** Storage can throw: the "installed" celebration may then show again on a later install. */
export function readInstallCelebrated(): boolean {
  try {
    return window.localStorage.getItem(INSTALL_CELEBRATED_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveInstallCelebrated(): void {
  try {
    window.localStorage.setItem(INSTALL_CELEBRATED_STORAGE_KEY, "1");
  } catch {
    // Intentionally ignored: the celebration is closed for this page anyway.
  }
}
