import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      title: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      image: z.string().optional(),
      /**
       * Language code used in the URL, e.g. "en", "es", "ja".
       * Defaults to "en" for existing posts without explicit lang frontmatter.
       */
      lang: z.string().min(2).max(10).default('en'),
      /**
       * Shared key across translations of the same post.
       * If omitted, you can treat the post's slug/id as the key.
       */
      translationKey: z.string().optional(),
    }),
});

const about = defineCollection({
  // Load Markdown files in the `src/content/about/` directory.
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    lang: z.string().min(2).max(10).default('en'),
  }),
});

export const collections = { posts, about };
