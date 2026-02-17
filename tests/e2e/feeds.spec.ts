import { expect, test } from '@playwright/test';

test.describe('feeds', () => {
  test('rss.xml is served with stylesheet', async ({ request }) => {
    const res = await request.get('/rss.xml');
    expect(res.ok()).toBeTruthy();

    const contentType = res.headers()['content-type'] || '';
    expect(contentType).toContain('application/rss+xml');

    const body = await res.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
    expect(body).toContain('rss-style.xsl');
  });

  test('atom.xml is served with stylesheet', async ({ request }) => {
    const res = await request.get('/atom.xml');
    expect(res.ok()).toBeTruthy();

    const contentType = res.headers()['content-type'] || '';
    expect(contentType).toContain('application/atom+xml');

    const body = await res.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<feed');
    expect(body).toContain('atom-style.xsl');
  });

  test('feed stylesheets are available', async ({ request }) => {
    const rss = await request.get('/feeds/rss-style.xsl');
    expect(rss.ok()).toBeTruthy();

    const atom = await request.get('/feeds/atom-style.xsl');
    expect(atom.ok()).toBeTruthy();
  });
});
