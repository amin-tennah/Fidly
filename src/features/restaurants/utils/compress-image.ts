import {
  IMAGE_MAX_SIDE_PX,
  IMAGE_QUALITY_MIN,
  IMAGE_QUALITY_START,
  IMAGE_QUALITY_STEP,
  MAX_SOURCE_IMAGE_BYTES,
  MAX_UPLOAD_BYTES,
} from "@/features/restaurants/constants";

/** Browser-only. Refuses non-images and files above the source limit with a French message. */
export function assertAcceptableSource(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new Error("Ce fichier n'est pas une image.");
  }
  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error("L'image dépasse 5 Mo. Choisissez une image plus légère.");
  }
}

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function drawScaled(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, IMAGE_MAX_SIDE_PX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas;
}

/** WebP when the browser can encode it, JPEG otherwise (a PNG fallback would be too heavy). */
async function encodeUnderLimit(canvas: HTMLCanvasElement): Promise<Blob | null> {
  const probe = await toBlob(canvas, "image/webp", IMAGE_QUALITY_START);
  const type = probe?.type === "image/webp" ? "image/webp" : "image/jpeg";
  for (
    let quality = IMAGE_QUALITY_START;
    quality >= IMAGE_QUALITY_MIN;
    quality -= IMAGE_QUALITY_STEP
  ) {
    const blob = await toBlob(canvas, type, quality);
    if (blob && blob.size <= MAX_UPLOAD_BYTES) {
      return blob;
    }
  }
  return null;
}

/** Resizes to `IMAGE_MAX_SIDE_PX` and re-encodes (WebP, else JPEG) below `MAX_UPLOAD_BYTES`. */
export async function compressImage(file: File): Promise<Blob> {
  assertAcceptableSource(file);
  let canvas: HTMLCanvasElement;
  try {
    canvas = await drawScaled(file);
  } catch {
    throw new Error("Impossible de lire cette image.");
  }
  const blob = await encodeUnderLimit(canvas);
  if (!blob) {
    throw new Error("Impossible de réduire cette image. Essayez-en une autre.");
  }
  return blob;
}
