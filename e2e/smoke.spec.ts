import { expect, test } from "@playwright/test";

test.describe("Fidly mobile smoke & auth guard test (375px)", () => {
  test("redirects unauthenticated visitor on / to /login and renders login form without console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);

    await expect(
      page.getByRole("heading", {
        name: "Accédez à vos cartes de fidélité",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Continuer avec Google" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Recevoir un code à 6 chiffres" }),
    ).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("redirects unauthenticated visitor on /pro and /admin to /login?next=...", async ({
    page,
  }) => {
    await page.goto("/pro");
    await expect(page).toHaveURL(/\/login\?next=%2Fpro$/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin$/);
  });
});
