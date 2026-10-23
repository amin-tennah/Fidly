export type DetectedImageType = "image/webp" | "image/jpeg" | "image/png";

const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const RIFF_SIGNATURE = [0x52, 0x49, 0x46, 0x46];
const WEBP_SIGNATURE = [0x57, 0x45, 0x42, 0x50];
const WEBP_TAG_OFFSET = 8;

function hasBytesAt(
  bytes: Uint8Array,
  signature: readonly number[],
  offset = 0,
): boolean {
  return signature.every((value, index) => bytes[offset + index] === value);
}

/**
 * Identifies an image from its magic bytes. The declared MIME type of an upload is
 * client-controlled and untrusted: only the content decides.
 */
export function detectImageType(bytes: Uint8Array): DetectedImageType | null {
  if (hasBytesAt(bytes, JPEG_SIGNATURE)) {
    return "image/jpeg";
  }
  if (hasBytesAt(bytes, PNG_SIGNATURE)) {
    return "image/png";
  }
  if (
    hasBytesAt(bytes, RIFF_SIGNATURE) &&
    hasBytesAt(bytes, WEBP_SIGNATURE, WEBP_TAG_OFFSET)
  ) {
    return "image/webp";
  }
  return null;
}

export const IMAGE_EXTENSIONS: Record<DetectedImageType, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};
