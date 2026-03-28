import { expect, test } from '@playwright/test';

test('redirect: /en/deterministic-context-analysis -> /en/durable-questions', async ({
  page,
}) => {
  await page.goto('/en/deterministic-context-analysis');
  await expect(page).toHaveURL(/\/en\/durable-questions/);
});

test('redirect: /deterministic-context-analysis -> /en/durable-questions', async ({
  page,
}) => {
  await page.goto('/deterministic-context-analysis');
  await expect(page).toHaveURL(/\/en\/durable-questions/);
});

// /durable-questions/ is a JS-redirect page - check raw HTML before the script fires.
test('legacy slug: /durable-questions/ has canonical -> /en/durable-questions/ and noindex', async ({
  request,
}) => {
  const response = await request.get('/durable-questions/');
  const html = await response.text();
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('/en/durable-questions/');
  expect(html).toContain('content="noindex"');
});
