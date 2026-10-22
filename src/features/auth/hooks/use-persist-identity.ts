"use client";

import { useEffect } from "react";
import {
  saveStoredIdentity,
  type StoredIdentity,
} from "@/features/auth/identity-storage";

/** Keeps the device copy of the identity in sync with the server-rendered one. */
export function usePersistIdentity(identity: StoredIdentity): void {
  const { userId, displayName, qrToken, shortCode } = identity;

  useEffect(() => {
    saveStoredIdentity({ userId, displayName, qrToken, shortCode });
  }, [userId, displayName, qrToken, shortCode]);
}
