/** An `AbortSignal` that fires after `ms` (`AbortSignal.timeout` is missing on older phones). */
export function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}
