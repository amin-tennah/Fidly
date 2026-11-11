"use client";

import { useState, type ReactNode } from "react";
import { CashierView } from "@/features/scanner/components/cashier-view";
import { CustomerDrawer } from "@/features/scanner/components/customer-drawer";
import { ManualCodeForm } from "@/features/scanner/components/manual-code-form";
import { ScanNotices } from "@/features/scanner/components/scan-notices";
import { ScanStartHero } from "@/features/scanner/components/scan-start-hero";
import { ScannerCamera } from "@/features/scanner/components/scanner-camera";
import { usePageVisibility } from "@/features/scanner/hooks/use-page-visibility";
import { type ScanFlow, useScanFlow } from "@/features/scanner/hooks/use-scan-flow";

interface ScannerScreenProps {
  readonly restaurantId: string;
  readonly restaurantName: string;
}

interface CameraCashierProps {
  readonly flow: ScanFlow;
  readonly restaurantName: string;
  readonly cameraError: string | null;
  readonly onCameraError: (message: string) => void;
  readonly onClose: () => void;
}

function CameraCashier({
  flow,
  restaurantName,
  cameraError,
  onCameraError,
  onClose,
}: CameraCashierProps): ReactNode {
  const { state } = flow;
  return (
    <CashierView
      restaurantName={restaurantName}
      onClose={onClose}
      camera={
        <ScannerCamera
          isPaused={state.step !== "idle"}
          onDecode={flow.decode}
          onErrorMessage={onCameraError}
        />
      }
      sheet={
        <>
          <ScanNotices state={state} cameraError={cameraError} />
          <ManualCodeForm isDisabled={state.step !== "idle"} onSubmit={flow.decode} />
        </>
      }
    />
  );
}

/**
 * The camera is started once by a tap (browsers require a gesture) and stays on between
 * two customers: only the decoding is paused while the drawer is open.
 */
export function ScannerScreen({
  restaurantId,
  restaurantName,
}: ScannerScreenProps): ReactNode {
  const flow = useScanFlow(restaurantId);
  const isVisible = usePageVisibility();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { state } = flow;

  return (
    <section aria-label="Scanner un client" className="space-y-4">
      {isCameraOn && isVisible ? (
        <CameraCashier
          flow={flow}
          restaurantName={restaurantName}
          cameraError={cameraError}
          onCameraError={setCameraError}
          onClose={() => setIsCameraOn(false)}
        />
      ) : (
        <>
          <ScanStartHero onStart={() => setIsCameraOn(true)} />
          <ScanNotices state={state} cameraError={cameraError} />
          <ManualCodeForm isDisabled={state.step !== "idle"} onSubmit={flow.decode} />
        </>
      )}
      <CustomerDrawer flow={flow} restaurantId={restaurantId} />
    </section>
  );
}
