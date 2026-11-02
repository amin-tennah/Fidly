import type { ReactNode } from "react";

const CORNERS = [
  "top-4 left-4 border-t-4 border-l-4 rounded-tl-xl",
  "top-4 right-4 border-t-4 border-r-4 rounded-tr-xl",
  "bottom-4 left-4 border-b-4 border-l-4 rounded-bl-xl",
  "bottom-4 right-4 border-b-4 border-r-4 rounded-br-xl",
] as const;

/** Lime corner marks over the dark camera zone. Decorative. */
export function ScannerCorners(): ReactNode {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {CORNERS.map((corner) => (
        <span key={corner} className={`border-gain absolute size-10 ${corner}`} />
      ))}
    </div>
  );
}
