"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGE_ASPECTS, ImageCropDialog, PickImageButton } from "@/features/media";
import { useRestaurantImage } from "@/features/restaurants/hooks/use-restaurant-image";
import type { RestaurantImageKind } from "@/features/restaurants/types";
import { cn } from "@/lib/utils";

export interface ImageUploadCardProps {
  readonly restaurantId: string;
  readonly kind: RestaurantImageKind;
  readonly title: string;
  readonly currentUrl: string | null;
}

const PREVIEW_CLASSES: Record<RestaurantImageKind, string> = {
  logo: "size-24 rounded-lg",
  cover: "aspect-video w-full rounded-lg",
};

interface ImagePreviewProps {
  readonly kind: RestaurantImageKind;
  readonly url: string | null;
  readonly title: string;
  readonly isPending: boolean;
}

function ImagePreview({ kind, url, title, isPending }: ImagePreviewProps): ReactNode {
  return (
    <div
      className={cn(
        "bg-muted relative overflow-hidden",
        PREVIEW_CLASSES[kind],
        isPending && "opacity-50",
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={title}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

function buttonLabel(isPending: boolean, hasImage: boolean): string {
  if (isPending) {
    return "Envoi en cours…";
  }
  return hasImage ? "Changer l'image" : "Choisir une image";
}

export function ImageUploadCard({
  restaurantId,
  kind,
  title,
  currentUrl,
}: ImageUploadCardProps): ReactNode {
  const flow = useRestaurantImage(restaurantId, kind);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ImagePreview
          kind={kind}
          url={currentUrl}
          title={title}
          isPending={flow.isPending}
        />
        <PickImageButton
          title={title}
          label={buttonLabel(flow.isPending, currentUrl !== null)}
          disabled={flow.isPending}
          onFile={flow.choose}
          className="w-full"
        />
      </CardContent>
      {flow.source ? (
        <ImageCropDialog
          imageUrl={flow.source.url}
          aspect={IMAGE_ASPECTS[kind]}
          title={title}
          onCancel={flow.cancel}
          onConfirm={flow.confirm}
        />
      ) : null}
    </Card>
  );
}
