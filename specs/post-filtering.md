# Spec: post filtering

Covers `getFilteredPosts` and `getSortedFilteredPosts` in `src/utils/draft.ts`.

Tests: `tests/unit/draft.test.ts`

---

## getFilteredPosts()

Returns all posts from the `posts` collection, excluding draft posts.
A post is a draft if its `id` starts with `_`.

### Behaviors

- Posts whose `id` starts with `_` are excluded from the result.
- Posts whose `id` does not start with `_` are included.
- If all posts are drafts, returns an empty array.
- If no posts are drafts, returns all posts unchanged.
- Does not mutate the original collection array.

### Inputs

None. Calls `getCollection('posts')` internally.

### Output

Array of `CollectionEntry<'posts'>` with no draft posts included.

---

## getSortedFilteredPosts(lang?)

Returns non-draft posts sorted newest-first by `pubDate`.
If `lang` is provided, only returns posts matching that language.

### Behaviors

- Always excludes draft posts (calls `getFilteredPosts` internally).
- Sorts by `pubDate` descending (newest first).
- When `lang` is omitted or `null` or `undefined`, returns posts in all languages.
- When `lang` is provided, returns only posts where `post.data.lang === lang`.
- Posts without an explicit `lang` field default to `'en'`.
- Excludes drafts even after the language filter is applied.
- Preserves sort order when filtering by language.
- Returns an empty array when no posts match the specified language.

### Sort key

`post.data.pubDate` (a `Date` object). Sort is descending by `.valueOf()`.

### Lang matching

```
(post.data.lang || 'en') === lang
```

Posts with no `lang` field are treated as `'en'`.

---

## Edge cases

- `lang` is an empty string `''` -> treated as a defined value; posts with `lang: 'en'`
  (or no lang) will not match because `'en' !== ''`.
- Two posts with the same `pubDate` -> sort order between them is unspecified (stable or not).
- A draft post matches the language filter -> it is still excluded (draft filter runs first).
- `lang` is `null` -> treated as no lang argument, returns all languages.
