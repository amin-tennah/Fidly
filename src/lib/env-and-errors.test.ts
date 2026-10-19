import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "./env";
import { APP_ERROR_MESSAGES, err, ok } from "./errors";

describe("parsePublicEnv", () => {
  it("returns validated env when all required variables are valid", () => {
    const result = parsePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    });

    expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
    expect(result.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("public-anon-key");
    expect(result.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("throws an explicit error when required variables are missing", () => {
    expect(() => parsePublicEnv({})).toThrowError(/Invalid environment configuration/);
  });
});

describe("ActionResult helpers", () => {
  it("builds a success ActionResult with ok()", () => {
    const result = ok({ stamps: 13 });
    expect(result).toEqual({ ok: true, data: { stamps: 13 } });
  });

  it("builds an error ActionResult with default French message", () => {
    const result = err("CUSTOMER_NOT_FOUND");
    expect(result).toEqual({
      ok: false,
      error: {
        code: "CUSTOMER_NOT_FOUND",
        message: APP_ERROR_MESSAGES.CUSTOMER_NOT_FOUND,
      },
    });
  });
});
