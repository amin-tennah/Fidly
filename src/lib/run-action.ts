import { APP_ERROR_MESSAGES, type ActionResult } from "@/lib/errors";

/** Longest wait for a Server Action before the screen gives up and offers a retry. */
export const ACTION_TIMEOUT_MS = 10_000;

function networkError<T>(): ActionResult<T> {
  return {
    ok: false,
    error: { code: "NETWORK_ERROR", message: APP_ERROR_MESSAGES.NETWORK_ERROR },
  };
}

/**
 * A Server Action can reject or hang on a flaky network (restaurant Wi-Fi, 4G): both
 * become a typed error instead of a crash or an endless spinner. A timed-out write may
 * still have succeeded, which is why retries reuse the same idempotency key.
 */
export async function runAction<T>(
  call: () => Promise<ActionResult<T>>,
  timeoutMs: number = ACTION_TIMEOUT_MS,
): Promise<ActionResult<T>> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<ActionResult<T>>((resolve) => {
    timer = setTimeout(() => resolve(networkError()), timeoutMs);
  });

  try {
    return await Promise.race([call(), timeout]);
  } catch {
    return networkError();
  } finally {
    clearTimeout(timer);
  }
}
