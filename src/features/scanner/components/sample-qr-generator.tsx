"use client";

import { QRCodeSVG } from "qrcode.react";
import { type ReactNode, useState } from "react";
import { SAMPLE_QR_TOKENS } from "../types";

export function SampleQrGenerator(): ReactNode {
  const [index, setIndex] = useState<number>(0);
  const currentToken = SAMPLE_QR_TOKENS[index] ?? SAMPLE_QR_TOKENS[0];

  const handleCycleToken = (): void => {
    setIndex((prev) => (prev + 1) % SAMPLE_QR_TOKENS.length);
  };

  return (
    <section
      aria-label="QR Code client de test"
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-zinc-900">
          QR Client témoin (à afficher sur un 2e téléphone)
        </h2>
        <button
          type="button"
          onClick={handleCycleToken}
          className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 active:bg-zinc-100"
        >
          Changer de client
        </button>
      </div>

      <div className="my-4 flex flex-col items-center justify-center rounded-xl bg-white p-4">
        <QRCodeSVG value={currentToken} size={200} level="M" includeMargin />
        <p className="mt-3 font-mono text-xs text-zinc-600">{currentToken}</p>
      </div>
    </section>
  );
}
