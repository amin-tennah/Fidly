"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/** The camera library is heavy: loaded on demand, never on the server (.cursorrules §10). */
const YudielQrReader = dynamic(
  () =>
    import("@/features/scanner/components/yudiel-qr-reader").then(
      (module) => module.YudielQrReader,
    ),
  {
    ssr: false,
    // Same box as the viewfinder (yudiel-qr-reader.tsx): nothing moves when the camera starts.
    loading: () => <Skeleton className="bg-ink-soft h-[270px] w-full rounded-[22px]" />,
  },
);

interface ScannerCameraProps {
  readonly isPaused: boolean;
  readonly onDecode: (value: string) => void;
  readonly onErrorMessage: (message: string) => void;
}

export function ScannerCamera({
  isPaused,
  onDecode,
  onErrorMessage,
}: ScannerCameraProps): ReactNode {
  return (
    <YudielQrReader
      isPaused={isPaused}
      onDecode={onDecode}
      onErrorMessage={onErrorMessage}
    />
  );
}
