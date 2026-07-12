import { defineConfig, devices } from "@playwright/test";

/**
 * Visual-regression + walkthrough Playwright config.
 * Baselines live in tests/visual/__screenshots__/ and are committed.
 * The Lovable sandbox dev server runs on http://localhost:8080.
 */
export default defineConfig({
  testDir: "./tests/visual",
  timeout: 60_000,
  expect: {
    // Small pixel tolerance so tiny anti-aliasing shifts don't fail the suite.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled" },
  },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PW_BASE_URL ?? "http://localhost:8080",
    trace: "off",
    video: "off",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
