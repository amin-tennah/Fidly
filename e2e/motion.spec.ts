import { expect, test } from "@playwright/test";

/** Properties a keyframe may animate: nothing that triggers layout. */
const ALLOWED_PROPERTIES = [
  "transform",
  "translate",
  "opacity",
  // Per-keyframe easing: a descriptor, not an animated property.
  "animation-timing-function",
];
/** What Tailwind's `transition-transform` covers: the transform family only. */
const TRANSFORM_FAMILY = "transform, translate, scale, rotate";
/** Paint-only exceptions set by the art direction: logo sweep and new-segment flash. */
const DOCUMENTED_EXCEPTIONS: Readonly<Record<string, readonly string[]>> = {
  write: ["clip-path"],
  segPop: ["filter"],
};
const REDUCED_DURATION_MAX_S = 0.001;

interface KeyframesUsage {
  readonly name: string;
  readonly properties: readonly string[];
}

test("motion: keyframes only animate transform and opacity (two documented exceptions)", async ({
  page,
}) => {
  await page.goto("/login");

  const usages = await page.evaluate((): KeyframesUsage[] => {
    const found: KeyframesUsage[] = [];
    const walk = (rules: CSSRuleList): void => {
      for (const rule of rules) {
        if (rule instanceof CSSKeyframesRule) {
          const properties = new Set<string>();
          for (const frame of rule.cssRules) {
            const style = (frame as CSSKeyframeRule).style;
            for (const property of style) {
              properties.add(property);
            }
          }
          found.push({ name: rule.name, properties: [...properties] });
        } else if ("cssRules" in rule) {
          walk((rule as CSSGroupingRule).cssRules);
        }
      }
    };
    for (const sheet of document.styleSheets) {
      walk(sheet.cssRules);
    }
    return found;
  });

  expect(usages.length).toBeGreaterThan(0);
  for (const { name, properties } of usages) {
    const allowed = [...ALLOWED_PROPERTIES, ...(DOCUMENTED_EXCEPTIONS[name] ?? [])];
    const offending = properties.filter((property) => !allowed.includes(property));
    expect(offending, `@keyframes ${name}`).toEqual([]);
  }
});

test("motion: with reduced motion the login steps switch without delay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");

  const steps = await page.evaluate(() =>
    [...document.querySelectorAll("[inert], :not([inert]) > form")]
      .map((node) => (node instanceof HTMLFormElement ? node.parentElement : node))
      .filter((node): node is HTMLElement => node instanceof HTMLElement)
      .map((node) => {
        const style = getComputedStyle(node);
        return {
          delays: style.transitionDelay.split(",").map((value) => parseFloat(value)),
          durations: style.transitionDuration
            .split(",")
            .map((value) => parseFloat(value)),
        };
      }),
  );

  expect(steps.length).toBeGreaterThanOrEqual(2);
  for (const step of steps) {
    expect(Math.max(...step.delays)).toBe(0);
    expect(Math.max(...step.durations)).toBeLessThanOrEqual(REDUCED_DURATION_MAX_S);
  }
});

test("motion: buttons give a pressed feedback through transform only", async ({
  page,
}) => {
  await page.goto("/login");
  const button = page.getByRole("button", { name: "Recevoir mon code" });

  await expect(button).toHaveCSS("transition-property", TRANSFORM_FAMILY);
});

test("motion: only the active login step is visible, the others are faded out", async ({
  page,
}) => {
  await page.goto("/login");

  const opacities = await page.evaluate(() =>
    [...document.querySelectorAll("form")]
      .map((form) => form.parentElement)
      .filter((node): node is HTMLElement => node instanceof HTMLElement)
      .map((node) => ({
        isInert: node.inert,
        opacity: getComputedStyle(node).opacity,
        properties: getComputedStyle(node).transitionProperty,
      })),
  );

  expect(opacities.length).toBeGreaterThanOrEqual(2);
  for (const step of opacities) {
    expect(step.opacity).toBe(step.isInert ? "0" : "1");
    expect(step.properties).toContain("opacity");
  }
});
