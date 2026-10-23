"use client";

import { Camera } from "lucide-react";
import type { ReactNode } from "react";
import { IMAGE_ASPECTS, ImageCropDialog, PickImageButton } from "@/features/media";
import { useRestaurantImage } from "@/features/restaurants/hooks/use-restaurant-image";
import type { RestaurantImageKind } from "@/features/restaurants/types";
import { cn } from "@/lib/utils";

export interface ImageEditButtonProps {
  readonly restaurantId: string;
  readonly kind: RestaurantImageKind;
  /** Accessible name, e.g. « Changer la bannière ». */
  readonly label: string;
  readonly className?: string;
}

/** Small camera button: pick a file, frame it, upload (logo or cover of the restaurant). */
export function ImageEditButton({
  restaurantId,
  kind,
  label,
  className,
}: ImageEditButtonProps): ReactNode {
  const flow = useRestaurantImage(restaurantId, kind);

  return (
    <>
      <PickImageButton
        title={label}
        label={flow.isPending ? "Envoi en cours…" : label}
        variant="secondary"
        size="icon"
        iconOnly
        icon={<Camera className="size-4" aria-hidden="true" />}
        disabled={flow.isPending}
        onFile={flow.choose}
        className={cn(
          "rounded-full shadow-md",
          flow.isPending && "animate-pulse",
          className,
        )}
      />
      {flow.source ? (
        <ImageCropDialog
          imageUrl={flow.source.url}
          aspect={IMAGE_ASPECTS[kind]}
          title={label}
          onCancel={flow.cancel}
          onConfirm={flow.confirm}
        />
      ) : null}
    </>
  );
}
