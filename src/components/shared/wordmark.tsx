import type { CSSProperties, ReactNode } from "react";
import {
  WORDMARK_GLYPHS,
  WORDMARK_STAMP,
  WORDMARK_VIEWBOX,
  type WordmarkGlyph,
} from "@/components/shared/wordmark-glyphs";
import { cn } from "@/lib/utils";

export interface WordmarkProps {
  readonly className?: string;
}

const { x, y, width, height } = WORDMARK_VIEWBOX;
const RIPPLE_OFFSET_MS = 230;

function percent(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

function glyphBox(glyph: WordmarkGlyph): CSSProperties {
  return {
    left: percent(glyph.x0 - x, width),
    width: percent(glyph.x1 - glyph.x0, width),
    animationDelay: `${glyph.delayMs}ms`,
  };
}

const stampBox: CSSProperties = {
  left: percent(WORDMARK_STAMP.x - x, width),
  top: percent(WORDMARK_STAMP.y - y, height),
  width: percent(WORDMARK_STAMP.size, width),
  height: percent(WORDMARK_STAMP.size, height),
  animationDelay: `${WORDMARK_STAMP.delayMs}ms`,
};

const rippleBox: CSSProperties = {
  ...stampBox,
  animationDelay: `${WORDMARK_STAMP.delayMs + RIPPLE_OFFSET_MS}ms`,
};

function Stamp(): ReactNode {
  return (
    <svg
      viewBox="0 0 40 40"
      className="animate-thump absolute opacity-0"
      style={stampBox}
    >
      <circle cx="20" cy="20" r="19.5" fill="var(--gain)" />
      <circle
        cx="20"
        cy="20"
        r="15"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.8"
        strokeDasharray="3 2.4"
      />
      <path
        d="M12.5 20.5l5.2 5.2 9.8-10.5"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Animated "rézone" logotype: letters written left to right, then the stamp lands. Decorative. */
export function Wordmark({ className }: WordmarkProps): ReactNode {
  return (
    <div
      aria-hidden="true"
      className={cn("relative", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {WORDMARK_GLYPHS.map((glyph) => (
        <svg
          key={glyph.id}
          viewBox={`${glyph.x0} ${y} ${glyph.x1 - glyph.x0} ${height}`}
          className="animate-write absolute top-0 h-full"
          style={glyphBox(glyph)}
        >
          <path d={glyph.path} fill="var(--cream)" />
        </svg>
      ))}
      <span
        className="animate-ripple border-gain absolute rounded-full border-4 opacity-0"
        style={rippleBox}
      />
      <Stamp />
    </div>
  );
}
