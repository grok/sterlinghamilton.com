# Spec: client events

Covers `onAstroPageLoad`, `getThemeFromDocument`, and `onThemeChange`
in `src/utils/client-events.ts`.

These functions are browser-only. They require `document` and cannot be unit tested
in a Node environment without jsdom. Test coverage is via E2E (Playwright).

---

## onAstroPageLoad(fn)

Runs a callback on initial page load and on every Astro client-side navigation.

### Why it exists

Astro's view transitions swap the DOM on navigation. Event listeners attached during
initial load are lost after a swap. This function re-runs setup logic after every navigation
by listening to the `astro:page-load` event.

### Behaviors

- If `document.readyState` is `'loading'` when called, waits for `DOMContentLoaded` before
  running `fn` the first time.
- If `document.readyState` is already past loading, schedules `fn` via `queueMicrotask`
  so it runs asynchronously but in the current task.
- Adds a persistent `astro:page-load` listener that runs `fn` on every navigation.
- Returns a cleanup function that removes the `astro:page-load` listener.

### Inputs

`fn: () => void` - callback to run on each page load

### Output

`() => void` - cleanup function; call it to stop listening to future navigations.

---

## getThemeFromDocument()

Reads the current theme from the document root element.

### Behaviors

- Returns `'dark'` if `document.documentElement.classList.contains('dark')` is true.
- Returns `'light'` otherwise.
- Does not read any storage (localStorage, sessionStorage) - reads DOM state only.

### Output

`ThemeName` - either `'light'` or `'dark'`

---

## onThemeChange(fn)

Subscribes to theme changes dispatched as a `themechange` custom event on `document`.

### Behaviors

- Calls `fn` with the new theme each time a `themechange` event is dispatched.
- The theme value passed to `fn` is read from the document at event time via
  `getThemeFromDocument()` - not from the event payload.
- Returns a cleanup function that removes the event listener.

### Inputs

`fn: (theme: ThemeName) => void` - callback called with the new theme on each change

### Output

`() => void` - cleanup function; call it to unsubscribe.

---

## Edge cases

- `onAstroPageLoad`: if the module loads after `DOMContentLoaded` has already fired,
  the initial run is scheduled via `queueMicrotask` to ensure it runs even if the event
  was missed.
- `onThemeChange`: the theme is re-read from the DOM at event time, not extracted from
  the event object. If `document.documentElement.classList` has not been updated before
  the event fires, `getThemeFromDocument` may return a stale value.
- Cleanup functions are not idempotent in the sense that calling them multiple times
  calls `removeEventListener` multiple times, but the second call is a no-op in the browser.
