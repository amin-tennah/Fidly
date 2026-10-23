"use client";

import { Download } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useTransition } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EASEL } from "@/features/admin/constants";
import { buildEaselUrl, easelFileName } from "@/features/admin/domain/easel";
import { downloadBlob } from "@/features/admin/utils/download-blob";
import { renderEaselPng } from "@/features/admin/utils/render-easel-png";

export interface EaselDownloadButtonProps {
  readonly name: string;
  readonly slug: string;
  readonly appUrl: string;
}

/** The hidden QR is drawn at half size and scaled by an exact factor of 2 into the easel. */
const HIDDEN_QR_SIZE = EASEL.qrSize / 2;

export function EaselDownloadButton({
  name,
  slug,
  appUrl,
}: EaselDownloadButtonProps): ReactNode {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [isPending, startTransition] = useTransition();

  const download = (): void => {
    startTransition(async () => {
      try {
        const qrCanvas = qrRef.current;
        if (!qrCanvas) {
          throw new Error("QR code indisponible.");
        }
        downloadBlob(await renderEaselPng(name, qrCanvas), easelFileName(slug));
      } catch (cause) {
        toast.error(cause instanceof Error ? cause.message : "Export impossible.");
      }
    });
  };

  return (
    <>
      <QRCodeCanvas
        ref={qrRef}
        value={buildEaselUrl(appUrl, slug)}
        size={HIDDEN_QR_SIZE}
        level="Q"
        marginSize={4}
        className="hidden"
        aria-hidden="true"
      />
      <Button type="button" variant="outline" disabled={isPending} onClick={download}>
        <Download className="size-4" aria-hidden="true" />
        {isPending ? "Création…" : "Chevalet (PNG)"}
      </Button>
    </>
  );
}
