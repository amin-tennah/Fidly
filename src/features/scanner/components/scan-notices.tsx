import type { ReactNode } from "react";
import type { ScanFlowState } from "@/features/scanner/domain/scan-flow-reducer";

interface ScanNoticesProps {
  readonly state: ScanFlowState;
  readonly cameraError: string | null;
}

/** Status line under the camera: camera problem, last notice or lookup in progress. */
export function ScanNotices({ state, cameraError }: ScanNoticesProps): ReactNode {
  if (cameraError) {
    return (
      <p role="alert" className="text-destructive text-sm">
        Caméra indisponible : {cameraError}. Utilisez le code du client ci-dessous.
      </p>
    );
  }
  if (state.step === "looking") {
    return (
      <p role="status" className="text-muted-foreground text-sm">
        Recherche du client…
      </p>
    );
  }
  if (state.step === "idle" && state.notice) {
    return (
      <p role="status" className="bg-secondary rounded-lg p-3 text-sm font-medium">
        {state.notice}
      </p>
    );
  }
  return null;
}
