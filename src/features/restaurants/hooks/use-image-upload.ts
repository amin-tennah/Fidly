"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { uploadRestaurantImage } from "@/features/restaurants/actions/upload-restaurant-image";
import type { ImageKind } from "@/features/restaurants/domain/media-path";
import { compressImage } from "@/features/restaurants/utils/compress-image";

export interface ImageUpload {
  readonly isPending: boolean;
  readonly upload: (file: File) => void;
}

/** Compresses the chosen image in the browser, then sends it through the Server Action. */
export function useImageUpload(restaurantId: string, kind: ImageKind): ImageUpload {
  const [isPending, startTransition] = useTransition();

  const upload = (file: File): void => {
    startTransition(async () => {
      try {
        const blob = await compressImage(file);
        const formData = new FormData();
        formData.set("restaurantId", restaurantId);
        formData.set("kind", kind);
        formData.set("file", blob, "image");
        const res = await uploadRestaurantImage(formData);
        if (res.ok) {
          toast.success("Image enregistrée.");
        } else {
          toast.error(res.error.message);
        }
      } catch (cause) {
        toast.error(cause instanceof Error ? cause.message : "L'envoi a échoué.");
      }
    });
  };

  return { isPending, upload };
}
