"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Cropper, { type Point } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { CROP_MAX_ZOOM, CROP_MIN_ZOOM } from "@/features/media/constants";
import type { CropArea } from "@/features/media/types";
import { ZoomSlider } from "./zoom-slider";

export interface ImageCropDialogProps {
  readonly imageUrl: string;
  readonly aspect: number;
  readonly title: string;
  readonly onCancel: () => void;
  readonly onConfirm: (crop: CropArea) => void;
}

/** The library only exposes its crop frame through inline styles: dashed outline for clarity. */
const CROP_FRAME_STYLE = {
  cropAreaStyle: { border: "2px dashed #ffffff" },
} as const;

interface ActionsProps {
  readonly canConfirm: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

function CropActions({ canConfirm, onCancel, onConfirm }: ActionsProps): ReactNode {
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="flex-1"
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button
        type="button"
        size="lg"
        className="flex-1"
        disabled={!canConfirm}
        onClick={onConfirm}
      >
        Valider le cadrage
      </Button>
    </div>
  );
}

interface StageProps {
  readonly imageUrl: string;
  readonly aspect: number;
  readonly crop: Point;
  readonly zoom: number;
  readonly onCropChange: (crop: Point) => void;
  readonly onZoomChange: (zoom: number) => void;
  readonly onAreaChange: (area: CropArea) => void;
}

function CropStage({ imageUrl, aspect, crop, zoom, ...handlers }: StageProps): ReactNode {
  return (
    <div className="relative flex-1">
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        minZoom={CROP_MIN_ZOOM}
        maxZoom={CROP_MAX_ZOOM}
        style={CROP_FRAME_STYLE}
        onCropChange={handlers.onCropChange}
        onZoomChange={handlers.onZoomChange}
        onCropComplete={(_, pixels) => handlers.onAreaChange(pixels)}
      />
    </div>
  );
}

export function ImageCropDialog({
  imageUrl,
  aspect,
  title,
  onCancel,
  onConfirm,
}: ImageCropDialogProps): ReactNode {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(CROP_MIN_ZOOM);
  const [area, setArea] = useState<CropArea | null>(null);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Cadrer : ${title}`}
      className="fixed inset-0 z-50 flex flex-col bg-black"
    >
      <p className="p-3 text-center text-sm font-medium text-white">
        Glissez l&apos;image pour la centrer, pincez ou utilisez le zoom.
      </p>
      <CropStage
        imageUrl={imageUrl}
        aspect={aspect}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onAreaChange={setArea}
      />
      <div className="bg-background space-y-3 p-4">
        <ZoomSlider zoom={zoom} onZoomChange={setZoom} />
        <CropActions
          canConfirm={area !== null}
          onCancel={onCancel}
          onConfirm={() => area && onConfirm(area)}
        />
      </div>
    </div>
  );
}
