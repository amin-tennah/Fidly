import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { IDENTITY_QR_STORAGE_KEY, IDENTITY_STORAGE_KEY } from "@/features/auth/constants";
import { SERVICE_WORKER_URL } from "./offline";

function readPublic(name: string): string {
  return readFileSync(path.join(process.cwd(), "public", name), "utf8");
}

describe("offline page", () => {
  const html = readPublic("offline.html");

  it("reads the same storage keys the app writes", () => {
    expect(html).toContain(`"${IDENTITY_STORAGE_KEY}"`);
    expect(html).toContain(`"${IDENTITY_QR_STORAGE_KEY}"`);
  });

  it("needs nothing from the network: no external script, style or image", () => {
    expect(html).not.toMatch(/<(?:script|link|img)[^>]+(?:src|href)=/);
  });

  it("never injects stored text as markup", () => {
    expect(html).not.toMatch(/innerHTML|outerHTML|insertAdjacentHTML|document\.write/);
  });
});

describe("service worker", () => {
  const worker = readPublic("sw.js");

  it("caches the offline page and the hashed build files only", () => {
    expect(worker).toContain('"/offline.html"');
    expect(worker).toContain('"/_next/static/"');
    expect(worker.match(/cache\.put\(/g)).toHaveLength(1);
  });

  it("names its cache after the build id and purges the others on activation", () => {
    expect(worker).toContain('searchParams.get("v")');
    expect(worker).toMatch(/name !== CACHE_NAME[\s\S]*caches\.delete/);
  });

  it("is registered with the build id in its URL", () => {
    expect(SERVICE_WORKER_URL).toMatch(/^\/sw\.js\?v=[^&=]+$/);
  });
});
