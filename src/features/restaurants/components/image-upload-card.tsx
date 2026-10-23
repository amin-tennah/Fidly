"use client";

import Image from "next/image";
import type { ChangeEvent, ReactNode } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImageKind } from "@/features/restaurants/domain/media-path";
import { IMAGE_ASPECTS } from "@/features/restaurants/constants";
import { useImageUploadFlow } from "@/features/restaurants/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { ImageCropDialog } from "./image-crop-dialog";

export interface ImageUploadCardProps {
  readonly restaurantId: string;
  readonly kind: ImageKind;
  readonly title: string;
  readonly currentUrl: string | null;
}

const PREVIEW_CLASSES: Record<ImageKind, string> = {
  logo: "size-24 rounded-lg",
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

interface PickImageButtonProps {
  readonly title: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly onFile: (file: File) => void;
}

function PickImageButton({
  title,
  label,
  disabled,
  onFile,
}: PickImageButtonProps): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label={`Choisir : ${title}`}
        onChange={(event) => forwardFirstFile(event, onFile)}
      />
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </Button>
    </>
  );
}

export function ImageUploadCard({
  restaurantId,
  kind,
  title,
  currentUrl,
}: ImageUploadCardProps): ReactNode {
  const flow = useImageUploadFlow(restaurantId, kind);
  const { isPending, source } = flow;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ImagePreview kind={kind} url={currentUrl} title={title} isPending={isPending} />
        <PickImageButton
          title={title}
          label={buttonLabel(isPending, currentUrl !== null)}
          disabled={isPending}
          onFile={flow.choose}
        />
      </CardContent>
      {source ? (
        <ImageCropDialog
          imageUrl={source.url}
          aspect={IMAGE_ASPECTS[kind]}
          title={title}
          onCancel={flow.cancel}
          onConfirm={flow.confirm}
        />
      ) : null}
    </Card>
  );
}
