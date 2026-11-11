"use client";

import { useEffect, type RefObject } from "react";
import { readQrSnapshot } from "@/features/auth/qr-snapshot";
import {
  saveStoredIdentity,
  saveStoredQr,
  type StoredIdentity,
} from "@/features/auth/identity-storage";

/**
 * Keeps the device copy of the identity in sync with the server-rendered one. When the
 * element holding the drawn QR is given, its path is kept too (offline page, ADR-025).
 */
export function usePersistIdentity(
  identity: StoredIdentity,
  qrContainer?: RefObject<HTMLElement | null>,
): void {
  const { userId, displayName, qrToken, shortCode } = identity;

  useEffect(() => {
    saveStoredIdentity({ userId, displayName, qrToken, shortCode });
    const snapshot = qrContainer?.current ? readQrSnapshot(qrContainer.current) : null;
    if (snapshot) {
      saveStoredQr(snapshot);
    }
  }, [userId, displayName, qrToken, shortCode, qrContainer]);
}
