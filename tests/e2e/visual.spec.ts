import { expect, test } from '@playwright/test';

async function stabilizePage(page: import('@playwright/test').Page) {
  // Prefer-reduced-motion affects some global CSS (and helps keep snapshots stable).
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Ensure theme is driven by system color scheme (not a persisted user choice),
  // so light/dark snapshots are stable across runs.
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('chiri-theme');
    } catch {}
  });

  // Let Astro finish initial rendering/hydration hooks.
  await page.waitForSelector('.wordmark-title');
  // Wait until ThemeManager applies either .light or .dark to <html>.
  await page.waitForFunction(() => {
    return (
      document.documentElement.classList.contains('light') ||
      document.documentElement.classList.contains('dark')
    );
  });

  // Disable animations/transitions to keep screenshot diffs stable.
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
      }
    `,
  });

  // Wait for fonts to settle.
  await page.evaluate(async () => {
    await document.fonts?.ready;
  });

  // Allow any requestAnimationFrame layout adjustments (e.g. back button positioning).
  await page.waitForTimeout(50);
}

test('visual: home page', async ({ page }) => {
  await page.goto('/en/');
  await stabilizePage(page);
  await expect(page).toHaveScreenshot('home.png');
});

test('visual: contact page', async ({ page }) => {
  await page.goto('/en/contact/');
  await stabilizePage(page);
  // Ensure the back button has run its positioning script before snapshotting.
  await page.waitForSelector('.back-button[data-positioned="true"]', { timeout: 10_000 });
  await expect(page).toHaveScreenshot('contact.png');
});

test('visual: article page', async ({ page }) => {
  await page.goto('/en/dont-sell-tomorrow/');
  await stabilizePage(page);
  await expect(page).toHaveScreenshot('article.png');
});

