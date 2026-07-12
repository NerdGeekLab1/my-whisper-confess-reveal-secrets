import { test, expect, Page } from "@playwright/test";

/**
 * Visual-regression checks for elements that historically overlap or lose contrast:
 *  - Header / nav bar (desktop + mobile)
 *  - Floating AI chat launcher
 *  - Category filter + "Recent / Trending / Most Supported" button group
 *  - Login button
 *
 * Baselines live in tests/visual/__screenshots__/ and are committed.
 * Run `npx playwright test --update-snapshots` to regenerate after intentional UI changes.
 */

async function stabilise(page: Page) {
  // Kill animation timing jitter and lazy images before capturing.
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur?.());
  await page.waitForLoadState("networkidle").catch(() => {});
}

test.describe("Home layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await stabilise(page);
  });

  test("header / nav bar", async ({ page }) => {
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot("header.png");
  });

  test("floating AI chat launcher", async ({ page }) => {
    // The launcher only renders on pages other than "ai-chat".
    const launcher = page.locator('[data-testid="floating-ai-chat"]').first();
    if (await launcher.count()) {
      await expect(launcher).toBeVisible();
      await expect(launcher).toHaveScreenshot("floating-ai-launcher.png");
    } else {
      test.info().annotations.push({ type: "skip", description: "Launcher not present on this page" });
    }
  });

  test("login button contrast", async ({ page }) => {
    const login = page
      .getByRole("button", { name: /log ?in|sign ?in/i })
      .first();
    if (await login.count()) {
      await expect(login).toBeVisible();
      await expect(login).toHaveScreenshot("login-button.png");
    }
  });
});

test.describe("Confessions controls", () => {
  test("category filter + sort buttons", async ({ page }) => {
    await page.goto("/");
    await stabilise(page);

    // Try to reach the category filter block. It's rendered on the confessions view.
    const category = page.locator('[data-testid="category-filter"]').first();
    if (await category.count()) {
      await expect(category).toBeVisible();
      await expect(category).toHaveScreenshot("category-filter.png");
    }

    const sortGroup = page.locator('[data-testid="sort-buttons"]').first();
    if (await sortGroup.count()) {
      await expect(sortGroup).toBeVisible();
      await expect(sortGroup).toHaveScreenshot("sort-buttons.png");
    }
  });
});
