"use client";

import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { ReactNode } from "react";
import { ScannerCorners } from "@/features/scanner/components/scanner-corners";

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
    <div className="bg-foreground relative aspect-square w-full overflow-hidden rounded-2xl">
      <Scanner
        onScan={handleScan}
        onError={handleError}
        paused={isPaused}
        formats={["qr_code"]}
        constraints={{ facingMode: "environment" }}
        components={{ finder: false }}
      />
      <ScannerCorners />
    </div>
  );
}
