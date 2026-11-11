import type { CSSProperties, ReactNode } from "react";
import {
  buildConfettiPieces,
  type ConfettiBurst as ConfettiBurstShape,
  type ConfettiPiece,
} from "@/features/loyalty/domain/confetti-pieces";
import { cn } from "@/lib/utils";

export interface ConfettiBurstProps {
  readonly burst: ConfettiBurstShape;
  /** Card colour index, 1 to 6: two of the four confetti colours come from the card. */
  readonly hue: number;
  /** Positions the centre of the burst (the element itself has no size). */
  readonly className?: string;
}

type PieceStyle = CSSProperties & Record<`--${string}`, string>;

function pieceStyle(piece: ConfettiPiece, hue: number): PieceStyle {
  const colors = [
    `var(--hue-${hue}-dark)`,
    "var(--gain)",
    "var(--cream)",
    `var(--hue-${hue}-light)`,
  ];
  return {
    "--dx": `${piece.dxPx}px`,
    "--dy": `${piece.dyPx}px`,
    "--fall": `${piece.fallPx}px`,
    "--r": `${piece.rotationDeg}deg`,
    width: piece.widthPx,
    height: piece.heightPx,
    backgroundColor: colors[piece.colorIndex],
    animationDuration: `${piece.durationMs}ms`,
    animationDelay: `${piece.delayMs}ms`,
  };
}

/** Confetti thrown once from a point, then falling (keyframes `pieceBurst`). Decorative. */
export function ConfettiBurst({ burst, hue, className }: ConfettiBurstProps): ReactNode {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-1/2 size-0", className)}
    >
      {buildConfettiPieces(burst).map((piece, index) => (
        <span
          key={index}
          className={cn(
            "animate-piece-burst absolute top-0 left-0",
            piece.isRound ? "rounded-full" : "rounded-[3px]",
          )}
          style={pieceStyle(piece, hue)}
        />
      ))}
    </div>
  );
}
