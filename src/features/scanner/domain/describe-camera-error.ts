/**
 * Reason shown to the cashier when the camera cannot start. Browsers report it as a
 * `DOMException` whose `name` is standard, while its `message` is English and technical.
 */
const CAMERA_ERROR_REASONS: Readonly<Record<string, string>> = {
  NotAllowedError: "l'accès a été refusé, autorisez-le dans les réglages du navigateur",
  SecurityError: "l'accès a été refusé, autorisez-le dans les réglages du navigateur",
  NotFoundError: "aucune caméra n'a été trouvée sur cet appareil",
  OverconstrainedError: "aucune caméra arrière n'a été trouvée sur cet appareil",
  NotReadableError: "elle est déjà utilisée par une autre application",
  AbortError: "elle est déjà utilisée par une autre application",
};

const UNKNOWN_CAMERA_REASON = "elle n'a pas pu démarrer";

/** French reason for a camera failure, written to follow "Caméra indisponible : ". */
export function describeCameraError(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  return CAMERA_ERROR_REASONS[name] ?? UNKNOWN_CAMERA_REASON;
}
