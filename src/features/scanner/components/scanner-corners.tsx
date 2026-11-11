import type { ReactNode } from "react";

const CORNERS = [
  "top-0 left-0 border-t-[7px] border-l-[7px] rounded-tl-[14px]",
  "top-0 right-0 border-t-[7px] border-r-[7px] rounded-tr-[14px]",
  "bottom-0 left-0 border-b-[7px] border-l-[7px] rounded-bl-[14px]",
  "bottom-0 right-0 border-b-[7px] border-r-[7px] rounded-br-[14px]",
] as const;

/** Lime viewfinder corners and the help line over the dark camera zone. Decorative. */
export function ScannerCorners(): ReactNode {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute top-1/2 left-1/2 size-[190px] -translate-x-1/2 -translate-y-1/2">
        {CORNERS.map((corner) => (
          <span key={corner} className={`border-gain absolute size-11 ${corner}`} />
        ))}
      </div>
      <p className="text-cream absolute inset-x-0 bottom-3 text-center text-sm font-semibold">
        Place le QR du client dans le cadre
      </p>
    </div>
  );
}
