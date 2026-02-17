import { expect, test } from '@playwright/test';

test('smoke: homepage responds', async ({ page }) => {
  await page.goto('/en/');
  await expect(page).toHaveURL(/\/en\/$/);
  // The site "wordmark" is rendered as styled text, not necessarily a semantic <h1>.
  await expect(
    page.locator('.wordmark-title', { hasText: "Hello, I'm Sterling!" }),
  ).toBeVisible();
});
