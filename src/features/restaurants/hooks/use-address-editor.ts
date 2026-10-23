"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateRestaurantAddress } from "@/features/restaurants/actions/update-restaurant-profile";
import { useAddressSearch } from "@/features/restaurants/hooks/use-address-search";
import type { AddressSuggestion } from "@/features/restaurants/types";

export interface AddressEditor {
  readonly query: string;
  readonly suggestions: readonly AddressSuggestion[];
  readonly hasFailed: boolean;
  readonly isPending: boolean;
  readonly canSave: boolean;
  readonly type: (value: string) => void;
  readonly pick: (suggestion: AddressSuggestion) => void;
  readonly save: () => void;
}

function useSaveAddress(
  restaurantId: string,
  selected: AddressSuggestion | null,
  onSaved: () => void,
): { readonly isPending: boolean; readonly save: () => void } {
  const [isPending, startTransition] = useTransition();

  const save = (): void => {
    if (!selected) {
      return;
    }
    startTransition(async () => {
      const { label, lng, lat } = selected;
      const res = await updateRestaurantAddress({
        restaurantId,
        address: label,
        lng,
        lat,
      });
      if (res.ok) {
        toast.success("Adresse enregistrée.");
        onSaved();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return { isPending, save };
}

/**
 * State of the address card: free typing triggers the autocomplete, picking a suggestion
 * freezes the choice, and only a picked suggestion (with real coordinates) can be saved.
 */
export function useAddressEditor(
  restaurantId: string,
  currentAddress: string | null,
): AddressEditor {
  const [query, setQuery] = useState(currentAddress ?? "");
  const [isTyping, setIsTyping] = useState(false);
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const { suggestions, hasFailed } = useAddressSearch(isTyping ? query : "");
  const { isPending, save } = useSaveAddress(restaurantId, selected, () =>
    setSelected(null),
  );

  const type = (value: string): void => {
    setSelected(null);
    setIsTyping(true);
    setQuery(value);
  };
  const pick = (suggestion: AddressSuggestion): void => {
    setSelected(suggestion);
    setIsTyping(false);
    setQuery(suggestion.label);
  };

  const canSave = selected !== null && !isPending;
  return { query, suggestions, hasFailed, isPending, canSave, type, pick, save };
}
