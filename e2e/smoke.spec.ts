import { test, expect } from "@playwright/test";

/**
 * Smoke tests for dfl-skill-evals (DevSharper).
 * These verify that critical pages load without crashing.
 * They do NOT require authentication or a running Judge0 instance.
 */

test.describe("Smoke tests", () => {
  test("home page loads and shows challenge grid", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DevSharper|Skill|Challenge/i);
    // The page should render without a blank screen
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("auth page loads", async ({ page }) => {
    await page.goto("/auth");
    // Should show login form or auth UI
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("unknown route returns page content (not blank)", async ({ page }) => {
    const response = await page.goto("/nonexistent-route-test");
    // Next.js should return 404 page, not crash
    expect(response?.status()).toBeLessThan(500);
  });
});
