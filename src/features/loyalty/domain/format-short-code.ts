import {
  SHORT_CODE_GROUP_SIZE,
  SHORT_CODE_LENGTH,
  SHORT_CODE_PLACEHOLDER,
} from "@/features/loyalty/constants";

/** Groups the 6-character backup code for reading aloud (`7DNWSA` → `7DN WSA`). */
export function formatShortCode(code: string | null | undefined): string {
  if (!code || code.length !== SHORT_CODE_LENGTH) {
    return SHORT_CODE_PLACEHOLDER;
  }
  return `${code.slice(0, SHORT_CODE_GROUP_SIZE)} ${code.slice(SHORT_CODE_GROUP_SIZE)}`;
}
