"use client";

import { Html5Qrcode } from "html5-qrcode";
import { type ReactNode, useEffect, useId, useRef } from "react";

interface Html5QrReaderProps {
  readonly isPaused: boolean;
  readonly onDecode: (value: string) => void;
  readonly onErrorMessage: (message: string) => void;
}

function startHtml5Scanner(
  containerId: string,
  onFrameDecode: (text: string) => void,
  onErrorMessage: (message: string) => void,
): () => void {
  const scanner = new Html5Qrcode(containerId);
  let isMounted = true;

  scanner
    .start(
      { facingMode: "environment" },
      { fps: 15, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        if (isMounted) {
          onFrameDecode(decodedText);
        }
      },
      () => undefined,
    )
    .catch((err: unknown) => {
      if (isMounted) {
        onErrorMessage(
          err instanceof Error ? err.message : "Erreur d'ouverture html5-qrcode",
        );
      }
    });

  return () => {
    isMounted = false;
    if (scanner.isScanning) {
      void scanner.stop().catch(() => undefined);
    }
  };
}

export function Html5QrReader({
  isPaused,
  onDecode,
  onErrorMessage,
}: Html5QrReaderProps): ReactNode {
  const rawId = useId();
  const containerId = `html5-qr-${rawId.replace(/:/g, "")}`;
  const isPausedRef = useRef<boolean>(isPaused);
  const onDecodeRef = useRef(onDecode);

  useEffect(() => {
    isPausedRef.current = isPaused;
    onDecodeRef.current = onDecode;
  }, [isPaused, onDecode]);

  useEffect(
    () =>
      startHtml5Scanner(
        containerId,
        (text) => {
          if (!isPausedRef.current) {
            onDecodeRef.current(text);
          }
        },
        onErrorMessage,
      ),
    [containerId, onErrorMessage],
  );

  return (
    <div
      id={containerId}
      className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-900"
    />
  );
}
