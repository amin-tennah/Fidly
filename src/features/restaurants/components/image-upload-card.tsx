"use client";

import Image from "next/image";
import type { ChangeEvent, ReactNode } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImageKind } from "@/features/restaurants/domain/media-path";
import { useImageUpload } from "@/features/restaurants/hooks/use-image-upload";
import { cn } from "@/lib/utils";

export interface ImageUploadCardProps {
  readonly restaurantId: string;
  readonly kind: ImageKind;
  readonly title: string;
  readonly currentUrl: string | null;
}

const PREVIEW_CLASSES: Record<ImageKind, string> = {
  logo: "size-24 rounded-full",
  cover: "aspect-video w-full rounded-lg",
};

interface ImagePreviewProps {
  readonly kind: ImageKind;
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

/** Hands the chosen file over and resets the input so the same file can be picked again. */
function forwardFirstFile(
  event: ChangeEvent<HTMLInputElement>,
  onFile: (file: File) => void,
): void {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (file) {
    onFile(file);
  }
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { isPending, upload } = useImageUpload(restaurantId, kind);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ImagePreview kind={kind} url={currentUrl} title={title} isPending={isPending} />
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={`Choisir : ${title}`}
          onChange={(event) => forwardFirstFile(event, upload)}
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {buttonLabel(isPending, currentUrl !== null)}
        </Button>
      </CardContent>
    </Card>
  );
}
