import { expect, test } from '@playwright/test';

test.describe('acceptance: core UX expectations', () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('home: tab order is theme -> language -> (search when available)', async ({
    page,
  }) => {
    await page.goto('/en/');

    await page.keyboard.press('Tab');
    await expect(page.locator('#theme-toggle')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-language-button]')).toBeFocused();

    const hasSearch = await page.locator('#post-search-input').count();
    if (hasSearch) {
      await page.keyboard.press('Tab');
      await expect(page.locator('#post-search-input')).toBeFocused();
    }
  });

  test('home: search filters articles', async ({ page }) => {
    await page.goto('/en/');

    const input = page.locator('#post-search-input');
    if ((await input.count()) === 0) {
      await expect(page.locator('[data-no-posts]')).toBeVisible();
      return;
    }

    await input.fill('definitely-not-a-real-match');

    const count = await page.locator('[data-post-item]').count();
    await expect(page.locator('#post-search-meta')).toContainText(
      `0 of ${count} articles`,
    );
  });

  test('home: switching language updates URL and content; empty locale shows "no posts yet" message', async ({
    page,
  }) => {
    await page.goto('/en/');

    await page.locator('[data-language-button]').click();
    await page.locator('[data-language-item][data-lang="es"]').click();

    await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator('[data-no-posts]')).toBeVisible();
  });

  test('non-home pages: home navigation exists and returns to home', async ({
    page,
  }) => {
    await page.goto('/en/contact/');
    const indexLink = page.locator('a.wordmark[href="/en/"]');
    await expect(indexLink).toBeVisible();
    await indexLink.click();
    await expect(page).toHaveURL(/\/en\/$/);

    await page.goto('/debug/post/');
    const indexLink2 = page.locator('a.back-button[href="/en/"]');
    await expect(indexLink2).toBeVisible();
    await indexLink2.click();
    await expect(page).toHaveURL(/\/en\/$/);
  });

  test('contact: social links grid includes my socials', async ({ page }) => {
    await page.goto('/en/contact/');

    const grid = page.locator('[data-social-grid]');
    await expect(grid).toBeVisible();

    await expect(
      grid.locator('a[title="LinkedIn"][href="https://www.linkedin.com/in/sterlinghamilton/"]'),
    ).toBeVisible();
    await expect(
      grid.locator('a[title="GitHub"][href="https://github.com/grok"]'),
    ).toBeVisible();
    await expect(
      grid.locator(
        'a[title="Instagram"][href="https://www.instagram.com/sterhamke/"]',
      ),
    ).toBeVisible();
  });

  test('post: TOC click scrolls to heading and updates hash', async ({
    page,
  }) => {
    await page.goto('/debug/post/');

    // Click a deeper heading so the scroll delta is unambiguous.
    await page.locator('.toc-container a[href="#diagram"]').click();
    await expect(page).toHaveURL(/#diagram$/);

    await page.waitForFunction(() => window.scrollY > 80);
  });

  test('post: clicking heading copies permalink and shows toast', async ({
    page,
  }) => {
    await page.goto('/debug/post/');

    await page.locator('#the-idea').click();
    await expect(page.locator('.toast-region')).toContainText('Copied link.');

    // Clicking a heading should also behave like landing on the permalink.
    await expect(page).toHaveURL(/#the-idea$/);
    await page.waitForFunction(() => window.scrollY > 80);

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('/debug/post/#the-idea');
  });

  test('post: code blocks can be copied and show toast', async ({ page }) => {
    await page.goto('/debug/post/');

    const copyButton = page.locator('.expressive-code .copy button').first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    await expect(page.locator('.toast-region')).toContainText('Copied code.');

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('type SpikeResult');
  });

  test('post: mermaid diagrams are horizontally centered', async ({ page }) => {
    await page.goto('/debug/post/');

    // Wait for at least one diagram to finish rendering.
    await expect(page.locator('.mermaid svg').first()).toBeVisible();

    const isCentered = await page.evaluate(() => {
      const el = document.querySelector('.mermaid');
      if (!(el instanceof HTMLElement)) return false;
      const styles = getComputedStyle(el);
      return styles.display === 'flex' && styles.justifyContent === 'center';
    });

    expect(isCentered).toBeTruthy();
  });

  test('post: mermaid renders; can fullscreen; can close', async ({ page }) => {
    await page.goto('/debug/post/');

    const svg = page.locator('.mermaid svg');
    await expect(svg).toBeVisible();

    const fullscreen = page
      .locator('.mermaid-fullscreen[aria-disabled="false"]')
      .first();
    await expect(fullscreen).toBeVisible();
    // The button is visually overlaid; the SVG can sometimes intercept pointer events in headless runs.
    await page.locator('.mermaid-block').first().hover();
    await fullscreen.click({ force: true });

    const dialog = page.locator('#mermaid-dialog');
    await expect(dialog).toHaveAttribute('open', '');

    await dialog.locator('.mermaid-dialog__close').click();
    await expect(dialog).not.toHaveAttribute('open', '');
  });

  test('post: language switching is disabled when no translation exists', async ({
    page,
  }) => {
    await page.goto('/debug/post/');

    const button = page.locator('[data-language-button]');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toHaveAttribute(
      'data-tooltip',
      'No translations available',
    );
    await expect(page.locator('[data-language-menu]')).toBeHidden();
  });

  test('responsive: no horizontal overflow on mobile for home and article', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/en/');
    const homeCanScrollX = await page.evaluate(() => {
      const start = window.scrollX;
      window.scrollTo({ left: 1000, top: window.scrollY });
      const after = window.scrollX;
      // Reset to avoid affecting subsequent assertions/screenshots.
      window.scrollTo({ left: 0, top: window.scrollY });
      return after !== start;
    });
    expect(homeCanScrollX).toBeFalsy();

    await page.goto('/debug/post/');
    const postCanScrollX = await page.evaluate(() => {
      const start = window.scrollX;
      window.scrollTo({ left: 1000, top: window.scrollY });
      const after = window.scrollX;
      window.scrollTo({ left: 0, top: window.scrollY });
      return after !== start;
    });
    expect(postCanScrollX).toBeFalsy();
  });

  test('theme: code blocks are visually distinct from page background in both modes', async ({
    page,
  }) => {
    await page.goto('/debug/post/');

    const distinct = async () => {
      return await page.evaluate(() => {
        const code = document.querySelector('.expressive-code');
        if (!(code instanceof HTMLElement)) return false;
        const codeBg = getComputedStyle(code).backgroundColor;
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        return Boolean(codeBg && bodyBg && codeBg !== bodyBg);
      });
    };

    expect(await distinct()).toBeTruthy();

    // Toggle theme and re-check.
    const wasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    await page.locator('#theme-toggle').click();
    await page.waitForFunction(
      (prev) => document.documentElement.classList.contains('dark') !== prev,
      wasDark,
    );

    expect(await distinct()).toBeTruthy();
  });
});
