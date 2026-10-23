"use server";

import {
  ADDRESS_SEARCH_CACHE_SECONDS,
  ADDRESS_SEARCH_LIMIT,
  ADDRESS_SEARCH_MIN_CHARS,
  ADDRESS_SEARCH_URL,
} from "@/features/restaurants/constants";
import { parseAddressSuggestions } from "@/features/restaurants/domain/parse-address-suggestions";
import {
  searchAddressesSchema,
  type SearchAddressesInput,
} from "@/features/restaurants/schemas";
import type { AddressSuggestion } from "@/features/restaurants/types";
import { type ActionResult, err, ok } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Address autocomplete through the national geocoder (ADR-007). Runs server-side so the
 * browser never calls a third party; identical queries are cached for an hour.
 */
export async function searchAddresses(
  input: SearchAddressesInput,
): Promise<ActionResult<readonly AddressSuggestion[]>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return err("UNAUTHORIZED");
  }
  const parsed = searchAddressesSchema.safeParse(input);
  if (!parsed.success || parsed.data.query.length < ADDRESS_SEARCH_MIN_CHARS) {
    return err("VALIDATION_ERROR");
  }

  const params = new URLSearchParams({
    q: parsed.data.query,
    limit: String(ADDRESS_SEARCH_LIMIT),
    autocomplete: "1",
  });
  try {
    const response = await fetch(`${ADDRESS_SEARCH_URL}?${params.toString()}`, {
      next: { revalidate: ADDRESS_SEARCH_CACHE_SECONDS },
    });
    if (!response.ok) {
      return err("INTERNAL_ERROR");
    }
    return ok(parseAddressSuggestions(await response.json()));
  } catch (cause) {
    console.error(
      "Address search failed",
      cause instanceof Error ? cause.message : cause,
    );
    return err("INTERNAL_ERROR");
  }
}
