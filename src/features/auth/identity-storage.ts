import { IDENTITY_QR_STORAGE_KEY, IDENTITY_STORAGE_KEY } from "@/features/auth/constants";

/**
 * Identity kept on the device so the personal QR can be redisplayed instantly, even
 * without network (`public/offline.html` reads it). `qrToken` is the QR content itself:
 * it is wiped on sign-out and never contains an email or a role.
 */
export interface StoredIdentity {
  readonly userId: string;
  readonly displayName: string;
  readonly qrToken: string;
  readonly shortCode: string;
}

/** The QR as drawn on screen: SVG view box and the path of its dark modules. */
export interface StoredQr {
  readonly viewBox: string;
  readonly path: string;
}

/** Storage can throw (private mode, blocked site data): persistence is best-effort. */
export function saveStoredIdentity(identity: StoredIdentity): void {
  try {
    window.localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(identity));
  } catch {
    // Intentionally ignored: the app works the same without local persistence.
  }
}

export function saveStoredQr(qr: StoredQr): void {
  try {
    window.localStorage.setItem(IDENTITY_QR_STORAGE_KEY, JSON.stringify(qr));
  } catch {
    // Intentionally ignored: the offline page then shows its "come back with network" message.
  }
}

export function clearStoredIdentity(): void {
  try {
    window.localStorage.removeItem(IDENTITY_STORAGE_KEY);
    window.localStorage.removeItem(IDENTITY_QR_STORAGE_KEY);
  } catch {
    // Intentionally ignored: nothing to clear when storage is unavailable.
  }
}
