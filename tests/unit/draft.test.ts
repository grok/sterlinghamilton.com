import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

import { getCollection } from 'astro:content';
import { getFilteredPosts, getSortedFilteredPosts } from '@/utils/draft';

const mockGetCollection = vi.mocked(getCollection);

function makePost(id: string, pubDate: Date, lang?: string) {
  return {
    id,
    data: { pubDate, ...(lang !== undefined ? { lang } : {}) },
  } as any;
}

describe('getFilteredPosts', () => {
  beforeEach(() => {
    mockGetCollection.mockReset();
  });

  it('excludes posts with _ prefix', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('_draft.md', new Date('2024-01-01')),
      makePost('published.md', new Date('2024-01-02')),
    ]);
    const posts = await getFilteredPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe('published.md');
  });

  it('includes posts without _ prefix', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('hello.md', new Date('2024-01-01')),
      makePost('world.md', new Date('2024-01-02')),
    ]);
    const posts = await getFilteredPosts();
    expect(posts).toHaveLength(2);
  });

  it('returns empty array when all posts are drafts', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('_a.md', new Date()),
      makePost('_b.md', new Date()),
    ]);
    const posts = await getFilteredPosts();
    expect(posts).toHaveLength(0);
  });

  it('returns all posts when none are drafts', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('a.md', new Date()),
      makePost('b.md', new Date()),
      makePost('c.md', new Date()),
    ]);
    const posts = await getFilteredPosts();
    expect(posts).toHaveLength(3);
  });

  it('does not mutate the original collection', async () => {
    const original = [
      makePost('_draft.md', new Date()),
      makePost('published.md', new Date()),
    ];
    mockGetCollection.mockResolvedValue(original);
    await getFilteredPosts();
    expect(original).toHaveLength(2);
  });
});

describe('getSortedFilteredPosts', () => {
  beforeEach(() => {
    mockGetCollection.mockReset();
  });

  it('sorts newest-first by pubDate', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('old.md', new Date('2024-01-01'), 'en'),
      makePost('new.md', new Date('2024-03-01'), 'en'),
      makePost('mid.md', new Date('2024-02-01'), 'en'),
    ]);
    const posts = await getSortedFilteredPosts();
    expect(posts[0].id).toBe('new.md');
    expect(posts[1].id).toBe('mid.md');
    expect(posts[2].id).toBe('old.md');
  });

  it('returns all languages when lang is omitted', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('post-en.md', new Date(), 'en'),
      makePost('post-es.md', new Date(), 'es'),
    ]);
    const posts = await getSortedFilteredPosts();
    expect(posts).toHaveLength(2);
  });

  it('returns only matching language when lang is specified', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('post-en.md', new Date(), 'en'),
      makePost('post-es.md', new Date(), 'es'),
    ]);
    const posts = await getSortedFilteredPosts('es');
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe('post-es.md');
  });

  it('posts without explicit lang default to en', async () => {
    mockGetCollection.mockResolvedValue([makePost('no-lang.md', new Date())]);
    const posts = await getSortedFilteredPosts('en');
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe('no-lang.md');
  });

  it('excludes drafts even after language filter', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('_draft-es.md', new Date(), 'es'),
      makePost('published-es.md', new Date(), 'es'),
    ]);
    const posts = await getSortedFilteredPosts('es');
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe('published-es.md');
  });

  it('preserves sort order when filtering by language', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('old-es.md', new Date('2024-01-01'), 'es'),
      makePost('new-es.md', new Date('2024-03-01'), 'es'),
      makePost('mid-en.md', new Date('2024-02-15'), 'en'),
    ]);
    const posts = await getSortedFilteredPosts('es');
    expect(posts).toHaveLength(2);
    expect(posts[0].id).toBe('new-es.md');
    expect(posts[1].id).toBe('old-es.md');
  });

  it('returns empty array when no posts match language', async () => {
    mockGetCollection.mockResolvedValue([
      makePost('post-en.md', new Date(), 'en'),
    ]);
    const posts = await getSortedFilteredPosts('es');
    expect(posts).toHaveLength(0);
  });
});
