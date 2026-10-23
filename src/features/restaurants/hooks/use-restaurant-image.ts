"use client";

import { useImageUploadFlow, type ImageUploadFlow } from "@/features/media";
import { uploadRestaurantImage } from "@/features/restaurants/actions/upload-restaurant-image";
import type { RestaurantImageKind } from "@/features/restaurants/types";

/** Pick → frame → upload of the logo or the cover of a restaurant. */
export function useRestaurantImage(
  restaurantId: string,
  kind: RestaurantImageKind,
): ImageUploadFlow {
  return useImageUploadFlow((image) => {
    const formData = new FormData();
    formData.set("restaurantId", restaurantId);
    formData.set("kind", kind);
    formData.set("file", image, "image");
    return uploadRestaurantImage(formData);
  });
}
