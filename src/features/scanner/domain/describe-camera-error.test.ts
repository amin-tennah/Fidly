import { describe, expect, it } from "vitest";
import { describeCameraError } from "./describe-camera-error";

function cameraError(name: string): Error {
  const error = new Error("Requested device not found");
  error.name = name;
  return error;
}

describe("describeCameraError", () => {
  it("explains a refused permission and how to fix it", () => {
    expect(describeCameraError(cameraError("NotAllowedError"))).toContain("refusé");
  });

  it("tells when the device has no camera", () => {
    expect(describeCameraError(cameraError("NotFoundError"))).toContain("aucune caméra");
  });

  it("tells when another application holds the camera", () => {
    expect(describeCameraError(cameraError("NotReadableError"))).toContain(
      "autre application",
    );
  });

  it("never leaks the browser's English message", () => {
    const reason = describeCameraError(cameraError("SomethingNew"));
    expect(reason).toBe("elle n'a pas pu démarrer");
    expect(describeCameraError("boom")).toBe(reason);
  });
});
