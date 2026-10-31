import "server-only";

/** Server-only public entry of the feature: guards reusable by other features' actions. */
export { authorizeRestaurantOwner, type ServerSupabase } from "./actions/owner-guard";
export { authorizeRestaurantStaff } from "./actions/staff-guard";
