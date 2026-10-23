import { describe, expect, it } from "vitest";
import { buildPublicMediaUrl } from "@/lib/supabase/media-url";
import { detectImageType } from "./detect-image-type";
import { buildMediaPath, isOwnMediaPath } from "./media-path";

const RESTAURANT_ID = "a4a4a4a4-aaaa-4aaa-8aaa-aaaaaaaaaaa1";

function bytes(...values: number[]): Uint8Array {
  return Uint8Array.from(values);
}

describe("detectImageType", () => {
  it("recognises JPEG, PNG and WebP by their magic bytes", () => {
    expect(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("image/jpeg");
    expect(detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe(
      "image/png",
    );
    const webp = bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50);
    expect(detectImageType(webp)).toBe("image/webp");
  });

  it("refuses anything else, whatever its declared type", () => {
    expect(detectImageType(new TextEncoder().encode("<svg onload=alert(1)>"))).toBeNull();
    expect(detectImageType(new TextEncoder().encode("GIF89a"))).toBeNull();
    expect(
      detectImageType(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x41, 0x56, 0x45)),
    ).toBeNull();
    expect(detectImageType(bytes())).toBeNull();
  });
});

describe("media paths", () => {
  it("builds a path inside the restaurant folder", () => {
    expect(buildMediaPath(RESTAURANT_ID, "logo", "abc", "webp")).toBe(
      `${RESTAURANT_ID}/logo-abc.webp`,
    );
  });

  it("only accepts files directly in the own folder", () => {
    expect(isOwnMediaPath(`${RESTAURANT_ID}/logo-abc.webp`, RESTAURANT_ID)).toBe(true);
    expect(isOwnMediaPath(`autre/logo-abc.webp`, RESTAURANT_ID)).toBe(false);
    expect(isOwnMediaPath(`${RESTAURANT_ID}/../autre/x.webp`, RESTAURANT_ID)).toBe(false);
    expect(isOwnMediaPath(`${RESTAURANT_ID}/sub/x.webp`, RESTAURANT_ID)).toBe(false);
    expect(isOwnMediaPath(`${RESTAURANT_ID}/`, RESTAURANT_ID)).toBe(false);
  });
});

describe("buildPublicMediaUrl", () => {
  it("joins the project URL, bucket and path without double slashes", () => {
    expect(buildPublicMediaUrl("https://x.supabase.co/", "id/logo.webp")).toBe(
      "https://x.supabase.co/storage/v1/object/public/restaurant-media/id/logo.webp",
    );
  });
});
