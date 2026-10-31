import { describe, expect, it, vi } from "vitest";
import { authorizeRealtime } from "@/lib/realtime/authorize-realtime";

function fakeClient(session: { access_token: string } | null, error: unknown = null) {
  const setAuth = vi.fn(() => Promise.resolve());
  const client = {
    auth: { getSession: () => Promise.resolve({ data: { session }, error }) },
    realtime: { setAuth },
  };
  return { client, setAuth };
}

describe("authorizeRealtime", () => {
  it("gives the signed-in user's token to Realtime", async () => {
    const { client, setAuth } = fakeClient({ access_token: "jwt-123" });
    await authorizeRealtime(client);
    expect(setAuth).toHaveBeenCalledWith("jwt-123");
  });

  it("leaves Realtime untouched without a session", async () => {
    const { client, setAuth } = fakeClient(null);
    await authorizeRealtime(client);
    expect(setAuth).not.toHaveBeenCalled();
  });

  it("leaves Realtime untouched when the session cannot be read", async () => {
    const { client, setAuth } = fakeClient({ access_token: "jwt" }, new Error("boom"));
    await authorizeRealtime(client);
    expect(setAuth).not.toHaveBeenCalled();
  });
});
