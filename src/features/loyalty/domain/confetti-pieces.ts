import { CONFETTI_COLOR_COUNT } from "@/features/loyalty/constants";

export interface ConfettiBurst {
  readonly count: number;
  /** Mean distance travelled from the centre. */
  readonly spreadPx: number;
  /** Upward bias: the burst rises before it falls. */
  readonly risePx: number;
  readonly fallPx: number;
  readonly delayMs: number;
}

export interface ConfettiPiece {
  readonly dxPx: number;
  readonly dyPx: number;
  readonly fallPx: number;
  readonly rotationDeg: number;
  readonly widthPx: number;
  readonly heightPx: number;
  readonly isRound: boolean;
  readonly colorIndex: number;
  readonly durationMs: number;
  readonly delayMs: number;
}

const ANGLE_JITTER_RAD = 0.5;
const MIN_DISTANCE_RATIO = 0.6;
const DISTANCE_JITTER_RATIO = 0.5;
const MIN_ROTATION_DEG = 200;
const ROTATION_JITTER_DEG = 400;
const BASE_SIZE_PX = 9;
const WIDTH_STEP_PX = 3;
const HEIGHT_STEP_PX = 5;
const ROUND_EVERY = 3;
const MIN_DURATION_MS = 1500;
const DURATION_JITTER_MS = 500;
const DELAY_JITTER_MS = 150;

/** Deterministic noise in [0, 1): the same burst on the server, the client and in tests. */
function noise(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 7.233) * 43758.5453;
  return value - Math.floor(value);
}

function buildPiece(index: number, burst: ConfettiBurst): ConfettiPiece {
  const angle = (index / burst.count) * Math.PI * 2 + noise(index + 3) * ANGLE_JITTER_RAD;
  const distance =
    burst.spreadPx * (MIN_DISTANCE_RATIO + noise(index + 9) * DISTANCE_JITTER_RATIO);
  return {
    dxPx: Math.round(Math.cos(angle) * distance),
    dyPx: Math.round(Math.sin(angle) * distance - burst.risePx),
    fallPx: burst.fallPx,
    rotationDeg: Math.round(MIN_ROTATION_DEG + noise(index + 30) * ROTATION_JITTER_DEG),
    widthPx: BASE_SIZE_PX + (index % 3) * WIDTH_STEP_PX,
    heightPx: BASE_SIZE_PX + (index % 2) * HEIGHT_STEP_PX,
    isRound: index % ROUND_EVERY === 0,
    colorIndex: index % CONFETTI_COLOR_COUNT,
    durationMs: Math.round(MIN_DURATION_MS + noise(index + 50) * DURATION_JITTER_MS),
    delayMs: Math.round(burst.delayMs + noise(index + 70) * DELAY_JITTER_MS),
  };
}

/** Pieces of a confetti burst, spread all around its centre (06-DA-ITERATION-2 §2 and §3). */
export function buildConfettiPieces(burst: ConfettiBurst): ConfettiPiece[] {
  return Array.from({ length: Math.max(0, burst.count) }, (_, index) =>
    buildPiece(index, burst),
  );
}
