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
  // The home page "About" content may include embeds. Mock external resources so the
  // screenshot is stable and not dependent on third-party rendering or availability.
  await page.route('https://open.spotify.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      headers: { 'cache-control': 'no-store' },
      body: '<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>',
    });
  });

  await page.route('https://www.youtube.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      headers: { 'cache-control': 'no-store' },
      body: '<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>',
    });
  });

  await page.route('**/api/proxy?url=*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      headers: { 'cache-control': 'no-store' },
      body: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Fixture Link Title</title>
    <meta property="og:title" content="Fixture Link Title" />
    <meta property="og:description" content="Fixture link description." />
  </head>
  <body>ok</body>
</html>`,
    });
  });

  await page.goto('/en/');
  await stabilizePage(page);

  // If the About content includes a link-card directive, wait for the enhancer to populate
  // deterministic content (domain + metadata via the mocked proxy).
  const linkCard = page
    .locator('.about a.link-card[data-url*="pitchfork.com"]')
    .first();
  if ((await linkCard.count()) > 0) {
    await expect(linkCard.locator('.link-card-url span')).toHaveText(
      'pitchfork.com',
    );
    await expect(linkCard.locator('.link-card-title')).toHaveText(
      'Fixture Link Title',
    );
  }

  await expect(page).toHaveScreenshot('home.png');
});

test('visual: contact page', async ({ page }) => {
  await page.goto('/en/contact/');
  await stabilizePage(page);
  // Ensure the back button has run its positioning script before snapshotting.
  await page.waitForSelector('.back-button[data-positioned="true"]', {
    timeout: 10_000,
  });
  await expect(page).toHaveScreenshot('contact.png');
});

test('visual: article page', async ({ page }) => {
  await page.goto('/debug/post/');
  await stabilizePage(page);
  await expect(page).toHaveScreenshot('post.png');
});

test('visual: enhancements section (mocked)', async ({ page }) => {
  // Mock X widgets script.
  await page.route('https://platform.twitter.com/widgets.js', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      },
      body: [
        'window.__twttrLoadCount = window.__twttrLoadCount || 0;',
        'window.twttr = window.twttr || {};',
        'window.twttr.widgets = window.twttr.widgets || {};',
        'window.twttr.widgets.load = function () { window.__twttrLoadCount++; };',
      ].join('\n'),
    });
  });

  // Mock GitHub repo API.
  await page.route('https://api.github.com/repos/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      },
      body: JSON.stringify({
        owner: { avatar_url: 'https://example.com/avatar.png' },
        description: 'Fixture repo description.',
        stargazers_count: 12,
        forks_count: 3,
        license: { spdx_id: 'MIT' },
      }),
    });
  });

  // Mock NeoDB API.
  await page.route('https://neodb.social/api/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      },
      body: JSON.stringify({
        category: 'movie',
        title: 'Fixture NeoDB Movie',
        rating: 8.6,
        year: 2026,
        director: ['Test Director'],
        actor: ['Test Actor'],
        genre: ['Test Genre'],
      }),
    });
  });

  // Mock the link-card proxy endpoint with deterministic HTML.
  await page.route('**/api/proxy?url=*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      headers: { 'cache-control': 'no-store' },
      body: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Fixture Link Title</title>
    <meta property="og:title" content="Fixture Link Title" />
    <meta property="og:description" content="Fixture link description." />
  </head>
  <body>ok</body>
</html>`,
    });
  });

  await page.goto('/debug/post/');
  await stabilizePage(page);

  const section = page.locator('[data-external-cards]');
  await section.scrollIntoViewIfNeeded();

  // Wait until the enhancers have populated.
  await expect(page.locator('.gc-container .gc-repo-description')).toHaveText(
    'Fixture repo description.',
  );
  await expect(page.locator('.neodb-card .neodb-title')).toContainText(
    'Fixture NeoDB Movie',
  );
  await expect(page.locator('.link-card .link-card-title')).toHaveText(
    'Fixture Link Title',
  );

  // Screenshot just the enhancements area (keeps the snapshot stable).
  await expect(section).toHaveScreenshot('enhancements.png');
});
