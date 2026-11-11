import { describe, expect, it } from "vitest";
import { decideInstallBanner, type InstallBannerInput } from "./decide-install-banner";
import { isIosDevice } from "./detect-platform";

const READY: InstallBannerInput = {
  isInstalled: false,
  hasFirstVisit: true,
  isDismissed: false,
  canPrompt: false,
  isIos: false,
  isAndroid: false,
};

describe("decideInstallBanner", () => {
  it("offers the native prompt when the browser provides one", () => {
    expect(decideInstallBanner({ ...READY, canPrompt: true })).toBe("prompt");
  });

  it("shows the manual steps on iOS, which has no prompt", () => {
    expect(decideInstallBanner({ ...READY, isIos: true })).toBe("ios-guide");
  });

  it("shows Chrome's menu steps on Android when no prompt was handed over", () => {
    expect(decideInstallBanner({ ...READY, isAndroid: true })).toBe("android-guide");
  });

  it("prefers the native prompt on Android when there is one", () => {
    expect(decideInstallBanner({ ...READY, isAndroid: true, canPrompt: true })).toBe(
      "prompt",
    );
  });

  it("shows nothing where the browser cannot install", () => {
    expect(decideInstallBanner(READY)).toBe("hidden");
  });

  it.each([
    ["the app is installed", { isInstalled: true }],
    ["the customer closed it this session", { isDismissed: true }],
    ["no visit was credited yet", { hasFirstVisit: false }],
  ])("stays hidden when %s", (_label, override) => {
    expect(
      decideInstallBanner({
        ...READY,
        canPrompt: true,
        isIos: true,
        isAndroid: true,
        ...override,
      }),
    ).toBe("hidden");
  });
});

describe("isIosDevice", () => {
  it("recognises an iPhone", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/605.1";
    expect(isIosDevice({ userAgent, maxTouchPoints: 5 })).toBe(true);
  });

  it("recognises an iPad that announces itself as a Mac", () => {
    const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1";
    expect(isIosDevice({ userAgent, maxTouchPoints: 5 })).toBe(true);
  });

  it("does not take a real Mac or an Android phone for an iOS device", () => {
    const mac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1";
    const android = "Mozilla/5.0 (Linux; Android 15; SM-S938B) Chrome/130 Mobile";
    expect(isIosDevice({ userAgent: mac, maxTouchPoints: 0 })).toBe(false);
    expect(isIosDevice({ userAgent: android, maxTouchPoints: 5 })).toBe(false);
  });
});
