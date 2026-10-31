"use server";

import { authorizeRestaurantStaff } from "@/features/restaurants/server";
import { mapScanRpcError } from "@/features/scanner/domain/map-scan-error";
import {
  classifyScanInput,
  normalizeScanInput,
} from "@/features/scanner/domain/normalize-scan-input";
import {
  lookupCustomerSchema,
  parseLookupRows,
  type LookupCustomerInput,
} from "@/features/scanner/schemas";
import type { CustomerLookup } from "@/features/scanner/types";
import { type ActionResult, err, ok } from "@/lib/errors";

/** Identifies a customer from a scanned QR token or a typed short code (Step 6.3). */
export async function lookupCustomer(
  input: LookupCustomerInput,
): Promise<ActionResult<CustomerLookup>> {
  const guard = await authorizeRestaurantStaff(input.restaurantId);
  if (!guard.ok) {
    return guard;
  }
  const parsed = lookupCustomerSchema.safeParse(input);
  if (!parsed.success || classifyScanInput(parsed.data.tokenOrCode) === "invalid") {
    return err("CUSTOMER_NOT_FOUND");
  }

  const { data, error } = await guard.data.rpc("lookup_customer", {
    p_token_or_code: normalizeScanInput(parsed.data.tokenOrCode),
    p_restaurant_id: parsed.data.restaurantId,
  });
  if (error) {
    return err(mapScanRpcError(error.message));
  }
  const customer = parseLookupRows(data);
  return customer ? ok(customer) : err("CUSTOMER_NOT_FOUND");
}
