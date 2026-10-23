"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { CropArea } from "@/features/media/types";
import {
  assertAcceptableSource,
  compressImage,
} from "@/features/media/utils/compress-image";
import type { ActionResult } from "@/lib/errors";

/** Sends the processed image to a Server Action (each feature supplies its own). */
export type SendImage = (image: Blob) => Promise<ActionResult<null>>;

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
async function cropAndSend(send: SendImage, file: File, crop: CropArea): Promise<void> {
  try {
    const res = await send(await compressImage(file, crop));
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
 * cropped and compressed in the browser and handed to `send`.
 */
export function useImageUploadFlow(send: SendImage): ImageUploadFlow {
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
    startTransition(() => cropAndSend(send, file, crop));
  };

  return { isPending, source, choose, cancel: close, confirm };
}
