import { mapScanRpcError } from "@/features/scanner/domain/map-scan-error";
import { parseScanResult } from "@/features/scanner/schemas";
import type { ScanOutcome } from "@/features/scanner/types";
import { type ActionResult, err, ok } from "@/lib/errors";

/** Turns the `{ data, error }` of a scan RPC into an `ActionResult`. */
export function toScanResult(
  data: unknown,
  error: { readonly message: string } | null,
): ActionResult<ScanOutcome> {
  if (error) {
    return err(mapScanRpcError(error.message));
  }
  const outcome = parseScanResult(data);
  return outcome ? ok(outcome) : err("INTERNAL_ERROR");
}
