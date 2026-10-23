import { z } from "zod";
import { ADDRESS_MAX_LENGTH } from "@/features/restaurants/constants";
import type { AddressSuggestion } from "@/features/restaurants/types";

const featureSchema = z.object({
  geometry: z.object({ coordinates: z.tuple([z.number(), z.number()]) }),
  properties: z.object({ label: z.string() }),
});

const responseSchema = z.object({ features: z.array(featureSchema) });

/**
 * Converts a geocoding response (GeoJSON, coordinates as `[lng, lat]`) into suggestions.
 * The response is untrusted input: anything unexpected yields no suggestion.
 */
export function parseAddressSuggestions(payload: unknown): readonly AddressSuggestion[] {
  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    return [];
  }
  return parsed.data.features.flatMap((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const label = feature.properties.label.trim();
    if (label.length === 0 || label.length > ADDRESS_MAX_LENGTH) {
      return [];
    }
    return [{ label, lng, lat }];
  });
}
