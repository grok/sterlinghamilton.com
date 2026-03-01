# Spec: feeds

Covers RSS 2.0 and Atom 1.0 generation in `src/utils/feed.ts`.

Endpoints: `/rss.xml` (RSS), `/atom.xml` (Atom)

---

## Feed metadata

Both feeds use metadata from `themeConfig.site`:

- `title` - from `themeConfig.site.name`
- `description` - from `themeConfig.site.description`
- `language` - from `themeConfig.site.language`
- `copyright` - "Copyright (c) {year} {author}"
- `id` / `link` - site URL with no trailing slash
- Cross-links: RSS feed links to Atom, Atom feed links to RSS

---

## Post inclusion

- Only non-draft posts are included (posts whose `id` does not start with `_`).
- Posts are sorted newest-first by `pubDate`.
- Posts in all languages are included (feeds are not language-filtered).

---

## Per-item fields

Each feed item includes:

| Field       | Source                                         |
| ----------- | ---------------------------------------------- |
| `title`     | `post.data.title`                              |
| `id`        | Absolute URL to the post                       |
| `link`      | Absolute URL to the post                       |
| `date`      | `post.data.pubDate`                            |
| `published` | `post.data.pubDate`                            |
| `content`   | Sanitized HTML rendered from Markdown          |
| `description` | Plain-text excerpt, max 200 characters       |

### Post URL construction

Post URL is constructed as: `{siteUrl}/{postLang}/{postSlug}`

- `postSlug` is `post.id` with the file extension removed.
- `postLang` is `post.data.lang || themeConfig.site.defaultLocale`, with any leading `/` stripped.

---

## Content rendering and sanitization

1. Markdown body is rendered to HTML via `markdown-it`.
2. Relative image paths are resolved to absolute URLs.
3. HTML is sanitized via `sanitize-html` with an extended allowlist.

### Sanitization allowlist additions beyond defaults

- Tags: `img`, `div`, `span` (in addition to default allowed tags)
- Attributes: `class`, `id` on any tag; `href`, `title`, `target`, `rel` on `a`;
  `src`, `alt`, `title`, `width`, `height` on `img`

### Image path resolution

- Absolute URLs (starting with `https://` or `//`) are passed through unchanged.
- Root-relative paths (starting with `/`) are resolved against the site base URL.
- Relative paths (starting with `./` or `../`) are resolved relative to the post's directory
  within `src/content/posts`.
  - In development: resolved to an absolute URL using the original path.
  - In production: optimized via Astro's `getImage` (format: webp, width: 800), then
    resolved to an absolute URL using the optimized path.
- If an image module is not found in the glob, a warning is logged and the image src
  is left as-is.

---

## Plain-text description

The `description` field is the first 200 characters of the sanitized content
converted to plain text (all HTML tags stripped, whitespace collapsed).

If the full plain text is 200 characters or shorter, no truncation occurs.
If longer, it is sliced at 200 characters and `...` is appended.

---

## Response format

- RSS: `Content-Type: application/rss+xml; charset=utf-8`
- Atom: `Content-Type: application/atom+xml; charset=utf-8`

Both feeds inject an XSL stylesheet processing instruction immediately after the
XML declaration for browser rendering:

- RSS: `/feeds/rss-style.xsl`
- Atom: `/feeds/atom-style.xsl`

---

## Edge cases

- Post with no body -> renders as empty string, description is empty.
- Post `lang` field with leading `/` -> stripped before URL construction.
- Image path resolution error -> falls back to the resolved absolute URL, logs error.
