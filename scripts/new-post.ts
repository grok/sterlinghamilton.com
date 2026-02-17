/**
 * scripts/new-post.ts
 *
 * What:
 * - Creates a new post file in `src/content/posts/` with basic frontmatter.
 *
 * Why:
 * - Standardizes filenames and frontmatter so content authoring is fast and consistent.
 *
 * How:
 * - `bun run new -- "My Post Title"`
 *
 * Notes:
 * - Prefix the title with `_` to create a draft (it keeps the underscore in the filename,
 *   but removes it from the visible title).
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';

// Process title from all arguments
const titleArgs: string[] = process.argv.slice(2);
const rawTitle: string =
  titleArgs.length > 0 ? titleArgs.join(' ') : 'new-post';

// Check if title starts with underscore (draft post)
const isDraft: boolean = rawTitle.startsWith('_');
const displayTitle: string = isDraft ? rawTitle.slice(1) : rawTitle;

const fileName: string = rawTitle
  .toLowerCase()
  .replace(/[^a-z0-9\s-_]/g, '') // Remove special characters but keep underscore and hyphen
  .replace(/\s+/g, '-') // Replace spaces with hyphens
  .replace(/-+/g, '-') // Replace multiple hyphens with single
  .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
const targetFile: string = `${fileName}.md`;
const fullPath: string = join('src/content/posts', targetFile);

// For i18n: translations across languages share a stable `translationKey`.
// Default to the slug-like filename, but strip the draft prefix `_` if present.
const translationKey: string = fileName.replace(/^_+/, '');

// Check if the target file already exists
if (existsSync(fullPath)) {
  console.error(`😇 File already exists: ${fullPath}`);
  process.exit(1);
}

// Ensure the directory structure exists
mkdirSync(dirname(fullPath), { recursive: true });

// Generate frontmatter with current date
const content: string = `---
title: ${displayTitle}
pubDate: '${new Date().toISOString().split('T')[0]}'
lang: en
translationKey: ${translationKey}
---

`;

// Write the new post file
try {
  writeFileSync(fullPath, content);
  if (isDraft) {
    console.log(`📝 Draft created: ${fullPath}`);
  } else {
    console.log(`✅ Post created: ${fullPath}`);
  }
} catch (error) {
  console.error('⚠️ Failed to create post:', error);
  process.exit(1);
}
