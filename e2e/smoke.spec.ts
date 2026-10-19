import { expect, test } from "@playwright/test";

test.describe("Fidly mobile smoke test (375px)", () => {
  test("renders the French home page and QR preview card without console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Votre carte de fidélité universelle de quartier",
      }),
    ).toBeVisible();

    await expect(page.getByLabel("Aperçu du QR code client")).toBeVisible();
    await expect(page.getByText("7 / 10 passages")).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});
