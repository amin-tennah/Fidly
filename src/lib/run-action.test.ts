import { describe, expect, it } from "vitest";
import { ok } from "@/lib/errors";
import { runAction } from "@/lib/run-action";

describe("runAction", () => {
  it("returns the result of the action", async () => {
    await expect(runAction(() => Promise.resolve(ok(1)))).resolves.toEqual(ok(1));
  });

  it("turns a rejection into a network error", async () => {
    const result = await runAction(() => Promise.reject(new Error("offline")));
    expect(result).toMatchObject({ ok: false, error: { code: "NETWORK_ERROR" } });
  });

  it("gives up on an action that never answers", async () => {
    const result = await runAction(() => new Promise<never>(() => undefined), 20);
    expect(result).toMatchObject({ ok: false, error: { code: "NETWORK_ERROR" } });
  });
});
