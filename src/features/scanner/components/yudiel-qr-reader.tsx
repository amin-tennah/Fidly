"use client";

import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { ReactNode } from "react";
import { ScannerCorners } from "@/features/scanner/components/scanner-corners";
import { describeCameraError } from "@/features/scanner/domain/describe-camera-error";

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
    onErrorMessage(describeCameraError(error));
  };

  return (
    <div className="bg-ink-soft rounded-panel relative h-[270px] w-full overflow-hidden">
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
