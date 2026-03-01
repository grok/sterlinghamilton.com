# Spec: about entry selection

Covers `pickAboutEntryByLang` in `src/utils/about.ts`.

Tests: `tests/unit/about.test.ts`

---

## pickAboutEntryByLang(entries, lang, fallbackLang?)

Picks the best-matching about page entry for the given locale.

### Behaviors

- Returns the entry whose `data.lang` matches the normalized form of `lang`.
- If no match is found, returns the entry matching `fallbackLang` (default `'en'`).
- If neither match is found, returns `undefined`.
- Entries with no `data.lang` field are treated as `'en'`.
- Lang normalization: any input starting with `'es'` (case-insensitive) normalizes to `'es'`;
  everything else normalizes to `'en'`.

### Inputs

- `entries: T[]` - array of objects with `id: string` and optional `data.lang: string`
- `lang: string` - the desired locale (e.g. `'en'`, `'es'`, `'es-ES'`)
- `fallbackLang?: string` - locale to fall back to if no primary match; defaults to `'en'`

### Output

`T | undefined` - the best-matching entry, or `undefined` if neither primary nor fallback found.

---

## Edge cases

- Empty entries array -> returns `undefined`.
- `lang` is an empty string -> normalizes to `'en'`; returns an English entry if one exists.
- `lang` is `'es-ES'` or `'es-MX'` -> normalizes to `'es'`; returns Spanish entry.
- Multiple entries with the same lang -> returns the first match found (array order).
- `fallbackLang` provided as `'es'` and no primary match -> returns Spanish entry as fallback.
- Entry has `data: undefined` -> treated as `lang: 'en'` via `e.data?.lang || 'en'`.
