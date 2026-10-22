import { describe, expect, it } from "vitest";
import {
  acceptInvitationSchema,
  sendEmailOtpSchema,
  updateDisplayNameSchema,
  verifyEmailOtpSchema,
} from "@/features/auth/schemas";
import { mapAuthErrorCode } from "./map-auth-error";
import {
  buildLoginPath,
  isPublicPath,
  sanitizeNextPath,
  withNextParam,
} from "./redirects";

describe("sanitizeNextPath", () => {
  it.each([
    ["/pro", "/pro"],
    ["/?ref=chez-mario", "/?ref=chez-mario"],
    ["/pro/logs?page=2", "/pro/logs?page=2"],
  ])("keeps the internal path %s", (raw, expected) => {
    expect(sanitizeNextPath(raw)).toBe(expected);
  });

  it.each([
    [undefined],
    [null],
    [""],
    ["https://evil.example"],
    ["//evil.example"],
    ["/\\evil.example"],
    ["javascript:alert(1)"],
    ["pro"],
  ])("falls back to / for unsafe value %s", (raw) => {
    expect(sanitizeNextPath(raw)).toBe("/");
  });
});

describe("buildLoginPath / withNextParam", () => {
  it("omits next when the destination is the client home", () => {
    expect(buildLoginPath("/")).toBe("/login");
    expect(withNextParam("/onboarding", "https://evil.example")).toBe("/onboarding");
  });

  it("encodes the destination", () => {
    expect(buildLoginPath("/?ref=chez-mario")).toBe("/login?next=%2F%3Fref%3Dchez-mario");
    expect(withNextParam("/onboarding", "/pro")).toBe("/onboarding?next=%2Fpro");
  });
});

describe("isPublicPath", () => {
  it.each(["/login", "/auth/callback"])("%s is public", (path) => {
    expect(isPublicPath(path)).toBe(true);
  });

  it.each(["/", "/pro", "/admin", "/onboarding", "/invitation", "/loginx"])(
    "%s requires a session",
    (path) => {
      expect(isPublicPath(path)).toBe(false);
    },
  );
});

describe("mapAuthErrorCode", () => {
  it("maps expired or wrong OTP to OTP_INVALID", () => {
    expect(mapAuthErrorCode("otp_expired")).toBe("OTP_INVALID");
  });

  it("maps rate limits to RATE_LIMITED", () => {
    expect(mapAuthErrorCode("over_email_send_rate_limit")).toBe("RATE_LIMITED");
  });

  it("falls back to AUTH_FAILED for unknown codes", () => {
    expect(mapAuthErrorCode(undefined)).toBe("AUTH_FAILED");
    expect(mapAuthErrorCode("unexpected_failure")).toBe("AUTH_FAILED");
  });
});

describe("auth Zod schemas", () => {
  it("normalizes email and validates 6-digit OTP code", () => {
    expect(sendEmailOtpSchema.parse({ email: "  User@Test.FR " }).email).toBe(
      "user@test.fr",
    );
    expect(
      verifyEmailOtpSchema.parse({ email: "user@test.fr", token: "123456" }).token,
    ).toBe("123456");
    expect(
      verifyEmailOtpSchema.safeParse({ email: "user@test.fr", token: "12345" }).success,
    ).toBe(false);
  });

  it("validates displayName and invitationId", () => {
    expect(
      updateDisplayNameSchema.parse({ displayName: "  Camille  " }).displayName,
    ).toBe("Camille");
    expect(updateDisplayNameSchema.safeParse({ displayName: "   " }).success).toBe(false);
    expect(
      acceptInvitationSchema.safeParse({
        invitationId: "f1f1f1f1-ffff-4fff-8fff-fffffffffff1",
      }).success,
    ).toBe(true);
  });
});
