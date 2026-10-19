export type ScannerEngine = "yudiel" | "html5-qrcode";

export interface ScanMeasurement {
  readonly id: string;
  readonly engine: ScannerEngine;
  readonly decodedValue: string;
  readonly elapsedMs: number;
  readonly warmStart: boolean;
  readonly timestamp: string;
}

export const SAMPLE_QR_TOKENS = [
  "fidly_tok_8f9k2m4p7q1x",
  "fidly_tok_3w5z9r2v6n8b",
  "fidly_tok_7h4j8k2m9p5t",
] as const;

export const SCAN_BUDGET_MS = 1300;
