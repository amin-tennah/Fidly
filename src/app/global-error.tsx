"use client";

import type { CSSProperties, ReactNode } from "react";

interface GlobalErrorProps {
  readonly retry: () => void;
}

/*
 * Last-resort screen when the root layout itself fails. It renders its own document and
 * Next.js does not load the global stylesheet here, so the brand colours are inlined
 * (the only place where `style` carries static values).
 */
const PAGE_STYLE: CSSProperties = {
  margin: 0,
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
  padding: 24,
  textAlign: "center",
  fontFamily: "system-ui, sans-serif",
  backgroundColor: "#fff4e6",
  color: "#0e1f17",
};

const BUTTON_STYLE: CSSProperties = {
  minHeight: 56,
  padding: "0 24px",
  border: 0,
  borderRadius: 16,
  fontSize: 19,
  fontWeight: 800,
  backgroundColor: "#0a5c3a",
  color: "#fff4e6",
};

export default function GlobalError({ retry }: GlobalErrorProps): ReactNode {
  return (
    <html lang="fr">
      <body style={PAGE_STYLE}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Rézone ne répond pas</h1>
        <p style={{ margin: 0 }}>
          Un souci est survenu de notre côté. Réessaie dans un instant.
        </p>
        <button type="button" style={BUTTON_STYLE} onClick={retry}>
          Réessayer
        </button>
      </body>
    </html>
  );
}
