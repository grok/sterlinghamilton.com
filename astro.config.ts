import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import playformInline from '@playform/inline';
import astroExpressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import path from 'node:path';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import { themeConfig } from './src/config';
import rehypeCleanup from './src/plugins/rehype-cleanup.mjs';
import rehypeImageProcessor from './src/plugins/rehype-image-processor.mjs';
import remarkEmbeddedMedia from './src/plugins/remark-embedded-media.mjs';
import remarkReadingTime from './src/plugins/remark-reading-time.mjs';
import remarkTOC from './src/plugins/remark-toc.mjs';
import { imageConfig } from './src/utils/image-config';

export default defineConfig({
  site: themeConfig.site.website,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: imageConfig,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: false,
    },
    remarkPlugins: [
      remarkMath,
      remarkDirective,
      remarkEmbeddedMedia,
      remarkReadingTime,
      remarkTOC,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeCleanup,
      rehypeImageProcessor,
    ],
  },
  integrations: [
    playformInline({
      Exclude: [(file: string) => file.toLowerCase().includes('katex')],
    }),
    // Must come before `mdx()` so MDX pages also get Expressive Code rendering.
    astroExpressiveCode(),
    mdx(),
    sitemap(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
});
