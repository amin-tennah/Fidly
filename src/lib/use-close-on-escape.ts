"use client";

import { useEffect } from "react";

/** Calls `onClose` when Escape is pressed, for as long as the calling overlay is mounted. */
export function useCloseOnEscape(onClose: () => void): void {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
}
