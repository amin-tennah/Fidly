import { INSTALL_DISMISSED_STORAGE_KEY } from "@/features/pwa/constants";

/** Storage can throw (private mode, blocked site data): the banner then simply comes back. */
export function readInstallDismissed(): boolean {
  try {
    return window.localStorage.getItem(INSTALL_DISMISSED_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveInstallDismissed(): void {
  try {
    window.localStorage.setItem(INSTALL_DISMISSED_STORAGE_KEY, "1");
  } catch {
    // Intentionally ignored: without storage the refusal lasts until the page closes.
  }
}
