# Spec: date formatting

Covers `formatDate` and `SUPPORTED_DATE_FORMATS` in `src/utils/date.ts`.

Tests: `tests/unit/date.test.ts`

---

## formatDate(date, format?)

Formats a JavaScript `Date` object as a string using the given format string.
If no format is provided, uses `themeConfig.date.dateFormat` at call time.

### Supported formats

Five format strings are recognized:

| Format string  | Example output                         | Notes                    |
| -------------- | -------------------------------------- | ------------------------ |
| YYYY-MM-DD     | 2024-03-05                             | Numeric, uses separator  |
| MM-DD-YYYY     | 03-05-2024                             | Numeric, uses separator  |
| DD-MM-YYYY     | 05-03-2024                             | Numeric, uses separator  |
| MONTH DAY YYYY | `<span class="month">Mar</span> 5 2024`  | Word month, no separator |
| DAY MONTH YYYY | `5 <span class="month">Mar</span> 2024`  | Word month, no separator |

### Separator behavior

The separator is read from `themeConfig.date.dateSeparator` at call time.

- Valid separators: `.`, `-`, `/`
- Invalid or missing separator defaults to `.`
- Separator applies only to numeric formats (YYYY-MM-DD, MM-DD-YYYY, DD-MM-YYYY)
- Word-month formats (MONTH DAY YYYY, DAY MONTH YYYY) ignore the separator entirely

### Padding

Single-digit months and days are zero-padded in all numeric formats.

- Month 3 -> `03`
- Day 5 -> `05`
- Month 12 and day 31 are not padded (already two digits)

### Unknown format fallback

If the format string is not one of the five recognized values, the function falls back
to `YYYY-MM-DD` behavior using the configured separator.

### Month names

English three-letter abbreviations: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec.

Month names are wrapped in `<span class="month">...</span>` in word-month formats.

---

## SUPPORTED_DATE_FORMATS

A readonly array containing exactly the five supported format strings:

```
['YYYY-MM-DD', 'MM-DD-YYYY', 'DD-MM-YYYY', 'MONTH DAY YYYY', 'DAY MONTH YYYY']
```

No other format strings are valid. This array can be used to validate config input.

---

## Edge cases

- `themeConfig.date.dateSeparator` is an empty string -> falls back to `.`
- `themeConfig.date.dateSeparator` is a space or any non-separator character -> falls back to `.`
- `format` argument is an empty string -> falsy, falls back to `themeConfig.date.dateFormat`
- `format` argument is whitespace -> trimmed to empty or unknown, falls back to `YYYY-MM-DD`
- Format string has leading/trailing whitespace -> trimmed before matching
