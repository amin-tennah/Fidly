import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design tokens of globals.css (`--radius-screen`, `--shadow-hero`, …) must be known
 * to the merge, or `rounded-screen` would not replace a component's default `rounded-lg`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["screen", "panel", "card", "block"],
      shadow: ["hero", "intro"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
