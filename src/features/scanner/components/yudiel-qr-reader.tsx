"use client";

import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { ReactNode } from "react";

interface YudielQrReaderProps {
  readonly isPaused: boolean;
  readonly onDecode: (value: string) => void;
  readonly onErrorMessage: (message: string) => void;
}

export function YudielQrReader({
  isPaused,
  onDecode,
  onErrorMessage,
}: YudielQrReaderProps): ReactNode {
  const handleScan = (detectedCodes: IDetectedBarcode[]): void => {
    const first = detectedCodes[0];
    if (first && first.rawValue) {
      onDecode(first.rawValue);
    }
  };

  const handleError = (error: unknown): void => {
    const message = error instanceof Error ? error.message : "Erreur d'accès à la caméra";
    onErrorMessage(message);
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-900">
      <Scanner
        onScan={handleScan}
        onError={handleError}
        paused={isPaused}
        formats={["qr_code"]}
        constraints={{ facingMode: "environment" }}
        components={{ finder: true }}
      />
    </div>
  );
}
