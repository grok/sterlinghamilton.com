# Content authoring (posts, drafts, translations)

Use this prompt to create new posts correctly (including drafts + multi-language content) without needing the old demo content.

## Project context (important)

- Posts live in: `src/content/posts/`
- Supported formats: `.md` and `.mdx`
- Locale-prefixed URLs:
  - Index: `/:lang/` (e.g. `/en/`, `/es/`)
  - Post: `/:lang/:slug/`
- **Draft mechanism**: filenames starting with `_` are excluded from lists/routes.

## Post frontmatter (schema)

Required:

- `title` (string)
- `pubDate` (date; `YYYY-MM-DD` is fine)

Optional (but recommended for i18n):

- `lang` (string, defaults to `en`)
- `translationKey` (string, use the same value for the same article across languages)
- `image` (string)

## Create a new post (English)

1. Create a file:
   - `src/content/posts/my-post.md`
2. Add frontmatter:

```yaml
---
title: My Post
pubDate: 2026-01-23
lang: en
---
```

## Create a draft post (hidden)

Draft posts are hidden if the filename starts with `_`.

### Option A: use the script

```bash
bun run new "_My Draft Title"
```

### Option B: create manually

- `src/content/posts/_my-draft.md`

```yaml
---
title: My Draft
pubDate: 2026-01-23
lang: en
---
```

## Publish the same article in two languages (EN + ES)

Create **one file per language** and set the same `translationKey`.

Example:

### English version

`src/content/posts/hello-world.md`

```yaml
---
title: Hello world
pubDate: 2026-01-23
lang: en
translationKey: hello-world
---
```

### Spanish version (slug can differ)

`src/content/posts/hola-mundo.md`

```yaml
---
title: Hola mundo
pubDate: 2026-01-23
lang: es
translationKey: hello-world
---
```

Notes:
- The language switcher on post pages uses `translationKey` to jump to the matching translation **even if slugs differ**.
- If a translation doesn’t exist for a locale, that locale will be hidden/disabled (depending on where the toggle is rendered).

## Quick checks

```bash
bun run check
bun dev
```

