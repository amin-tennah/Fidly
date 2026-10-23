import type { ReactNode } from "react";
import type { AddressSuggestion } from "@/features/restaurants/types";

export interface AddressSuggestionListProps {
  readonly suggestions: readonly AddressSuggestion[];
  readonly onPick: (suggestion: AddressSuggestion) => void;
}

export function AddressSuggestionList({
  suggestions,
  onPick,
}: AddressSuggestionListProps): ReactNode {
  if (suggestions.length === 0) {
    return null;
  }
  return (
    <ul
      aria-label="Adresses suggérées"
      className="border-border divide-border divide-y overflow-hidden rounded-lg border"
    >
      {suggestions.map((suggestion) => (
        <li key={`${suggestion.label}-${suggestion.lng}-${suggestion.lat}`}>
          <button
            type="button"
            className="hover:bg-muted min-h-12 w-full px-3 py-2 text-left text-sm"
            onClick={() => onPick(suggestion)}
          >
            {suggestion.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
