"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadRestaurantImage } from "@/features/restaurants/actions/upload-restaurant-image";
import type { ImageKind } from "@/features/restaurants/domain/media-path";
import type { CropArea } from "@/features/restaurants/types";
import {
  assertAcceptableSource,
  compressImage,
} from "@/features/restaurants/utils/compress-image";

export interface CropSource {
  readonly file: File;
  readonly url: string;
}

export interface ImageUploadFlow {
  readonly isPending: boolean;
  /** The file being framed, or `null` when the crop dialog is closed. */
  readonly source: CropSource | null;
  readonly choose: (file: File) => void;
  readonly cancel: () => void;
  readonly confirm: (crop: CropArea) => void;
}

/** Crops and compresses in the browser, then sends the result; every outcome is toasted. */
async function sendImage(
  restaurantId: string,
  kind: ImageKind,
  file: File,
  crop: CropArea,
): Promise<void> {
  try {
    const formData = new FormData();
    formData.set("restaurantId", restaurantId);
    formData.set("kind", kind);
    formData.set("file", await compressImage(file, crop), "image");
    const res = await uploadRestaurantImage(formData);
    if (res.ok) {
      toast.success("Image enregistrée.");
    } else {
      toast.error(res.error.message);
    }
  } catch (cause) {
    toast.error(cause instanceof Error ? cause.message : "L'envoi a échoué.");
  }
}

/**
 * Pick → frame → upload. The chosen file is checked first, shown in the crop dialog, then
 * cropped and compressed in the browser and sent through the Server Action.
 */
export function useImageUploadFlow(
  restaurantId: string,
  kind: ImageKind,
): ImageUploadFlow {
  const [source, setSource] = useState<CropSource | null>(null);
  const [isPending, startTransition] = useTransition();

  const close = (): void => {
    if (source) {
      URL.revokeObjectURL(source.url);
    }
    setSource(null);
  };

  const choose = (file: File): void => {
    try {
      assertAcceptableSource(file);
      setSource({ file, url: URL.createObjectURL(file) });
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Image refusée.");
    }
  };

  const confirm = (crop: CropArea): void => {
    if (!source) {
      return;
    }
    const { file } = source;
    close();
    startTransition(() => sendImage(restaurantId, kind, file, crop));
  };

  return { isPending, source, choose, cancel: close, confirm };
}
