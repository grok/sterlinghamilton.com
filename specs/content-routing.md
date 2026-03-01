# Spec: content routing

Describes URL structure, draft behavior, and language routing for this Astro site.

---

## URL structure

### Default locale (en)

Posts in the default locale use no locale prefix:

```
/posts/slug/
```

### Non-default locale (es)

Posts in other locales use a locale prefix:

```
/es/posts/slug/
```

Other pages follow the same pattern:

| Page    | English      | Spanish       |
| ------- | ------------ | ------------- |
| Home    | `/`          | `/es/`        |
| Contact | `/contact/`  | `/es/contact/`|
| 404     | `/404/`      | `/es/404/`    |

---

## Draft behavior

A post is a draft if its filename starts with `_`.

Example: `src/content/posts/_my-draft.md` is a draft.

Draft posts are:

- Excluded from all post listings.
- Excluded from RSS and Atom feeds.
- Excluded from the sitemap.
- Not routed - no URL is generated for them at build time.

The draft mechanism is filename-based, not frontmatter-based.
There is no `draft: true` frontmatter field.

---

## Language routing

Posts have an optional `lang` frontmatter field.
If `lang` is not set, the post is treated as English (`'en'`).

The site supports two locales: `en` (default) and `es`.

### Filtering rules

- `getSortedFilteredPosts('en')` returns posts with `lang: 'en'` or no `lang` field.
- `getSortedFilteredPosts('es')` returns posts with `lang: 'es'`.
- `getSortedFilteredPosts()` (no argument) returns posts in all languages.

### Translation pairing

Two posts with the same `translationKey` frontmatter value are translations of each other.
The language picker uses `translationKey` to find the alternate-language version of a post.

---

## Locale detection

The active locale is detected from the first URL pathname segment using `localeFromPathname`.

- `/es/posts/slug/` -> locale is `'es'`
- `/posts/slug/` -> locale is `'en'`

See `specs/i18n.md` for the full `localeFromPathname` contract.
