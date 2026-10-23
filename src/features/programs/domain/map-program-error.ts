import type { AppErrorCode } from "@/lib/errors";

const RPC_MESSAGE_TO_CODE: ReadonlyArray<readonly [string, AppErrorCode]> = [
  ["thresholds_not_increasing", "PROGRAM_THRESHOLDS_INVALID"],
  ["too_many_programs", "PROGRAM_LIMIT_REACHED"],
  ["invalid_program_order", "PROGRAM_ORDER_INVALID"],
  ["program_not_found", "PROGRAM_NOT_FOUND"],
  ["forbidden", "FORBIDDEN"],
  ["not_authenticated", "UNAUTHORIZED"],
];

/** Maps the message raised by a program RPC (`raise exception '<code>'`) to an app error code. */
export function mapProgramRpcError(message: string): AppErrorCode {
  const match = RPC_MESSAGE_TO_CODE.find(([marker]) => message.includes(marker));
  return match ? match[1] : "INTERNAL_ERROR";
}
