import { EASEL, EASEL_CAPTION, EASEL_FOOTER } from "@/features/admin/constants";
import { fitFontSize } from "@/features/admin/domain/easel";

const FONT_FAMILY = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const INK = "#111827";
const MUTED = "#6b7280";
const TITLE_BASELINE = 300;
const QR_TOP = 430;
const CAPTION_BASELINE = 1420;
const FOOTER_BASELINE = 1640;

function font(weight: number, px: number): string {
  return `${weight} ${px}px ${FONT_FAMILY}`;
}

function paintFrame(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, EASEL.width, EASEL.height);
  ctx.strokeStyle = EASEL.accent;
  ctx.lineWidth = 16;
  const inset = EASEL.margin / 2;
  ctx.strokeRect(inset, inset, EASEL.width - 2 * inset, EASEL.height - 2 * inset);
}

function paintText(
  ctx: CanvasRenderingContext2D,
  text: string,
  baseline: number,
  style: { readonly font: string; readonly color: string },
): void {
  ctx.font = style.font;
  ctx.fillStyle = style.color;
  ctx.textAlign = "center";
  ctx.fillText(text, EASEL.width / 2, baseline);
}

function paintTitle(ctx: CanvasRenderingContext2D, name: string): void {
  const maxWidth = EASEL.width - 2 * EASEL.margin - 40;
  const size = fitFontSize(
    (px) => {
      ctx.font = font(700, px);
      return ctx.measureText(name).width;
    },
    maxWidth,
    EASEL.titleMaxPx,
    EASEL.titleMinPx,
  );
  paintText(ctx, name, TITLE_BASELINE, { font: font(700, size), color: INK });
  ctx.fillStyle = EASEL.accent;
  ctx.fillRect((EASEL.width - 240) / 2, TITLE_BASELINE + 40, 240, 10);
}

/** The QR is drawn at an integer multiple of its source size, without smoothing: crisp modules. */
function paintQr(ctx: CanvasRenderingContext2D, qrCanvas: HTMLCanvasElement): void {
  ctx.imageSmoothingEnabled = false;
  const left = (EASEL.width - EASEL.qrSize) / 2;
  ctx.drawImage(qrCanvas, left, QR_TOP, EASEL.qrSize, EASEL.qrSize);
}

/**
 * Composes the printable easel (A6 portrait, 300 dpi): restaurant name, QR code, caption.
 * Browser only. `qrCanvas` is the already drawn QR of the restaurant address.
 */
export function renderEaselPng(
  restaurantName: string,
  qrCanvas: HTMLCanvasElement,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = EASEL.width;
  canvas.height = EASEL.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("Export impossible sur ce navigateur."));
  }

  paintFrame(ctx);
  paintTitle(ctx, restaurantName);
  paintQr(ctx, qrCanvas);
  paintText(ctx, EASEL_CAPTION, CAPTION_BASELINE, {
    font: font(600, EASEL.captionPx),
    color: INK,
  });
  paintText(ctx, EASEL_FOOTER, FOOTER_BASELINE, {
    font: font(400, EASEL.footerPx),
    color: MUTED,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export impossible."))),
      "image/png",
    );
  });
}
