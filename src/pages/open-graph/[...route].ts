import { type CollectionEntry, getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { themeConfig } from '../../config';

export const prerender = true;

const collectionEntries = await getCollection('posts');

type OGPage = {
  title: string;
  description: string;
};

const pages: Record<string, OGPage> = {
  site: {
    title: themeConfig.site.name,
    description: themeConfig.site.description,
  },
  ...Object.fromEntries(
    collectionEntries.map((entry: CollectionEntry<'posts'>) => [
      entry.id.replace(/\.(md|mdx)$/, ''),
      {
        title: entry.data.title,
        description: themeConfig.site.name,
      },
    ]),
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path: string, page: OGPage) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: 'public/og/og-logo-white.png',
      size: [56, 56],
    },
    bgGradient: [[136, 57, 239]], // Catppuccin Latte mauve
    padding: 64,
    font: {
      title: {
        color: [255, 255, 255],
        size: 68,
        weight: 'SemiBold',
        families: ['PingFang SC'],
      },
      description: {
        color: [239, 241, 245],
        size: 40,
        weight: 'Medium',
        families: ['PingFang SC'],
      },
    },
    fonts: [
      'https://cdn.jsdelivr.net/npm/font-pingfang-sc-font-weight-improved@latest/PingFangSC-Medium.woff2',
      'https://cdn.jsdelivr.net/npm/font-pingfang-sc-font-weight-improved@latest/PingFangSC-Semibold.woff2',
    ],
  }),
});
