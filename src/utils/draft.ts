import { type CollectionEntry, getCollection } from 'astro:content';

/**
 * Get all posts, filtering out posts whose filenames start with _
 */
export async function getFilteredPosts() {
  const posts = await getCollection('posts');
  if (import.meta.env.DEV) return posts;
  return posts.filter(
    (post: CollectionEntry<'posts'>) => !post.id.startsWith('_'),
  );
}

/**
 * Get all posts sorted by publication date, filtering out posts whose filenames start with _
 */
export async function getSortedFilteredPosts(lang?: string) {
  const posts = await getFilteredPosts();
  const filtered =
    lang == null
      ? posts
      : posts.filter((post) => (post.data.lang || 'en') === lang);
  return filtered.sort(
    (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
