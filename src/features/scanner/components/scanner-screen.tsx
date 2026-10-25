"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CustomerDrawer } from "@/features/scanner/components/customer-drawer";
import { ManualCodeForm } from "@/features/scanner/components/manual-code-form";
import { ScanNotices } from "@/features/scanner/components/scan-notices";
import { ScannerCamera } from "@/features/scanner/components/scanner-camera";
import { usePageVisibility } from "@/features/scanner/hooks/use-page-visibility";
import { useScanFlow } from "@/features/scanner/hooks/use-scan-flow";

interface ScannerScreenProps {
  readonly restaurantId: string;
}

/**
 * The camera is started once by a tap (browsers require a gesture) and stays on between
 * two customers: only the decoding is paused while the drawer is open.
 */
export function ScannerScreen({ restaurantId }: ScannerScreenProps): ReactNode {
  const flow = useScanFlow(restaurantId);
  const isVisible = usePageVisibility();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { state } = flow;

  return (
    <section aria-label="Scanner un client" className="space-y-4">
      {isCameraOn && isVisible ? (
        <ScannerCamera
          isPaused={state.step !== "idle"}
          onDecode={flow.decode}
          onErrorMessage={setCameraError}
        />
      ) : (
        <Button
          size="lg"
          className="min-h-40 w-full text-xl"
          onClick={() => setIsCameraOn(true)}
        >
          Scanner un client
        </Button>
      )}
      <ScanNotices state={state} cameraError={cameraError} />
      <ManualCodeForm isDisabled={state.step !== "idle"} onSubmit={flow.decode} />
      <CustomerDrawer flow={flow} />
    </section>
  );
}
