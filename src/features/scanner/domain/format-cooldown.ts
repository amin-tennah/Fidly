const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

/** `4380` → `1 h 13 min` ; below one minute, `moins d'une minute`. */
export function formatCooldownRemaining(seconds: number): string {
  const totalMinutes = Math.ceil(Math.max(0, seconds) / SECONDS_PER_MINUTE);
  if (totalMinutes < 1) {
    return "moins d'une minute";
  }
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  if (hours === 0) {
    return `${minutes} min`;
  }
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}
