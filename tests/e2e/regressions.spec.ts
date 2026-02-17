import { expect, test } from '@playwright/test';

test('theme toggle persists across navigation', async ({ page }) => {
  await page.goto('/en/contact/');

  // Start from a clean slate (use system theme)
  await page.evaluate(() => {
    try {
      localStorage.removeItem('chiri-theme');
    } catch {}
  });
  await page.reload();

  const initialIsDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark'),
  );

  await page.locator('#theme-toggle').click();
  await page.waitForFunction(
    (wasDark) =>
      document.documentElement.classList.contains('dark') !== wasDark,
    initialIsDark,
  );

  const stored = await page.evaluate(() => localStorage.getItem('chiri-theme'));
  expect(stored).toBe(initialIsDark ? 'light' : 'dark');

  await page.goto('/en/');
  const afterNavIsDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark'),
  );
  expect(afterNavIsDark).toBe(!initialIsDark);
});

test('contact icon is disabled on contact page', async ({ page }) => {
  await page.goto('/en/contact/');
  const icon = page.locator('.contact-icon-link');
  await expect(icon).toHaveAttribute('aria-disabled', 'true');
  await expect(icon).toHaveAttribute(
    'data-tooltip',
    "You're already on the contact page",
  );
  await expect(icon).not.toHaveAttribute('href', /.+/);
});

test('mermaid re-renders on theme toggle', async ({ page }) => {
  await page.goto('/debug/mermaid/');

  // Mermaid enhancements should replace the <pre> with an SVG.
  const svg = page.locator('.mermaid svg');
  await expect(svg).toBeVisible();

  const before = await svg.evaluate((el) => el.outerHTML);

  await page.locator('#theme-toggle').click();

  // Wait until the SVG output changes (theme variables cause different fills/strokes).
  await expect
    .poll(async () => await svg.evaluate((el) => el.outerHTML), {
      timeout: 10_000,
    })
    .not.toBe(before);
});

test('404: shows message and link back home', async ({ page }) => {
  await page.goto('/en/definitely-not-a-page/');

  await expect(page.locator('.wordmark-title')).toContainText('404');
  await expect(page.locator('[data-404]')).toContainText("ain't here");

  const back = page.locator('a.back-button[href="/en/"]');
  await expect(back).toBeVisible();

  const back2 = page.locator('[data-home-link][href="/en/"]');
  await expect(back2).toBeVisible();
});
