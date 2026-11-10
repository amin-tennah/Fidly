import { defineConfig, devices } from "@playwright/test";

/**
 * E2E runs against a production build on its own port: the dev server once served a stale
 * Turbopack module (Session 31), and animations must be measured as users get them.
 */
const E2E_PORT = 3100;
const E2E_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // One worker with a signed-in session too: its file is rewritten after each test.
  workers: process.env.CI || process.env.E2E_SESSION ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: E2E_URL,
    trace: "on-first-retry",
    viewport: { width: 375, height: 667 },
  },
  projects: [
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 667 },
        // A fake camera feed, accepted without a prompt (cashier tests).
        launchOptions: {
          args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
        },
      },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${E2E_PORT}`,
    url: E2E_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 240000,
  },
});
