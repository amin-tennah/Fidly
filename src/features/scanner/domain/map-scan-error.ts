import type { AppErrorCode } from "@/lib/errors";

const RPC_MESSAGE_TO_CODE: ReadonlyArray<readonly [string, AppErrorCode]> = [
  ["cooldown_active", "COOLDOWN_ACTIVE"],
  ["reward_not_available", "REWARD_NOT_UNLOCKED"],
  ["rate_limited", "RATE_LIMITED"],
  ["already_reversed", "REVERSAL_ALREADY_DONE"],
  ["not_reversible", "REVERSAL_NOT_ALLOWED"],
  ["not_latest_operation", "REVERSAL_NOT_ALLOWED"],
  ["log_not_found", "REVERSAL_NOT_ALLOWED"],
  ["no_active_program", "NO_ACTIVE_PROGRAM"],
  ["customer_not_found", "CUSTOMER_NOT_FOUND"],
  ["card_not_found", "CUSTOMER_NOT_FOUND"],
  ["forbidden", "FORBIDDEN"],
  ["not_authenticated", "UNAUTHORIZED"],
];

/** Maps the message raised by a scan RPC (`raise exception '<code>'`) to an app error code. */
export function mapScanRpcError(message: string): AppErrorCode {
  const match = RPC_MESSAGE_TO_CODE.find(([marker]) => message.includes(marker));
  return match ? match[1] : "INTERNAL_ERROR";
}
