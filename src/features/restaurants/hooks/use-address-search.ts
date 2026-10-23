"use client";

import { useEffect, useState } from "react";
import { searchAddresses } from "@/features/restaurants/actions/search-addresses";
import {
  ADDRESS_SEARCH_DEBOUNCE_MS,
  ADDRESS_SEARCH_MIN_CHARS,
} from "@/features/restaurants/constants";
import type { AddressSuggestion } from "@/features/restaurants/types";

export interface AddressSearchState {
  readonly suggestions: readonly AddressSuggestion[];
  readonly hasFailed: boolean;
}

interface TaggedResult extends AddressSearchState {
  readonly query: string;
}

const IDLE: AddressSearchState = { suggestions: [], hasFailed: false };

/**
 * Debounced address autocomplete. Each result is tagged with the query that produced it
 * and only shown while that query is still the current one, so stale answers are ignored.
 */
export function useAddressSearch(query: string): AddressSearchState {
  const [result, setResult] = useState<TaggedResult | null>(null);
  const trimmed = query.trim();
  const isSearchable = trimmed.length >= ADDRESS_SEARCH_MIN_CHARS;

  useEffect(() => {
    if (!isSearchable) {
      return undefined;
    }
    const timer = setTimeout(() => {
      void searchAddresses({ query: trimmed }).then((res) => {
        setResult(
          res.ok
            ? { query: trimmed, suggestions: res.data, hasFailed: false }
            : { query: trimmed, ...IDLE, hasFailed: true },
        );
      });
    }, ADDRESS_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [isSearchable, trimmed]);

  return isSearchable && result?.query === trimmed ? result : IDLE;
}
