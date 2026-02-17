import { expect, test } from '@playwright/test';

test.describe('ui enhancers (mocked external dependencies)', () => {
  test.beforeEach(async ({ context, page }) => {
    // Keep clipboards consistent for other debug-page UX (some scripts touch clipboard).
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Mock X widgets script.
    await page.route(
      'https://platform.twitter.com/widgets.js',
      async (route) => {
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
      },
    );

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
  });

  test('debug fixture: GitHubCard populates card content', async ({ page }) => {
    await page.goto('/debug/post/');

    const card = page.locator('.gc-container[data-repo="octocat/Hello-World"]');
    await expect(card).toBeVisible();
    await card.scrollIntoViewIfNeeded();

    await expect(card.locator('.gc-repo-description')).toHaveText(
      'Fixture repo description.',
    );
    await expect(card.locator('.gc-stars-count')).toHaveText('12');
    await expect(card.locator('.gc-forks-count')).toHaveText('3');
    await expect(card.locator('.gc-license-info')).toHaveText('MIT');
  });

  test('debug fixture: NeoDBCard replaces containers with rendered cards', async ({
    page,
  }) => {
    await page.goto('/debug/post/');

    const rendered = page.locator('.neodb-card');
    await expect(rendered).toBeVisible();
    await expect(rendered.locator('.neodb-title')).toContainText(
      'Fixture NeoDB Movie',
    );
  });

  test('debug fixture: LinkCard fetches metadata via proxy and updates UI', async ({
    page,
  }) => {
    await page.goto('/debug/post/');

    const card = page.locator('.link-card[data-url]');
    await expect(card).toBeVisible();
    await card.scrollIntoViewIfNeeded();

    // Domain should be updated without waiting for the proxy response.
    await expect(card.locator('.link-card-url span')).toHaveText('example.com');

    // Metadata should fill title/description from mocked HTML.
    await expect(card.locator('.link-card-title')).toHaveText(
      'Fixture Link Title',
    );
    await expect(card.locator('.link-card-description')).toHaveText(
      'Fixture link description.',
    );
  });

  test('debug fixture: XPOST follows theme toggle and triggers widgets.load on theme change', async ({
    page,
  }) => {
    await page.goto('/debug/post/');

    const embed = page.locator('.twitter-tweet');
    await expect(embed).toBeVisible();

    // Wait for the widgets script to have been requested and executed.
    await page.waitForFunction(() => {
      const w = window as unknown as { twttr?: unknown };
      return Boolean(w.twttr);
    });

    const beforeTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    const beforeDataTheme = await embed.getAttribute('data-theme');
    expect(beforeDataTheme).toBe(beforeTheme ? 'dark' : 'light');

    const beforeLoads = await page.evaluate(() => {
      const w = window as unknown as { __twttrLoadCount?: number };
      return w.__twttrLoadCount || 0;
    });

    await page.locator('#theme-toggle').click();
    await page.waitForFunction(
      (prev) => document.documentElement.classList.contains('dark') !== prev,
      beforeTheme,
    );

    await expect(embed).toHaveAttribute(
      'data-theme',
      beforeTheme ? 'light' : 'dark',
    );

    await expect
      .poll(async () => {
        return await page.evaluate(() => {
          const w = window as unknown as { __twttrLoadCount?: number };
          return w.__twttrLoadCount || 0;
        });
      })
      .toBeGreaterThan(beforeLoads);
  });
});
