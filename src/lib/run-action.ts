import { APP_ERROR_MESSAGES, type ActionResult } from "@/lib/errors";

/** A Server Action can reject on a flaky network: that becomes a typed error, not a crash. */
export async function runAction<T>(
  call: () => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  try {
    return await call();
  } catch {
    return {
      ok: false,
      error: { code: "NETWORK_ERROR", message: APP_ERROR_MESSAGES.NETWORK_ERROR },
    };
  }
}
