export type ThemeName = 'light' | 'dark';

/**
 * Run a callback on initial load and on Astro client navigations.
 *
 * Why:
 * - Astro swaps pages on navigation, so we need to re-bind DOM listeners after swaps.
 * - `astro:page-load` fires on initial load and on navigation.
 * - Some modules may execute after the initial event, so we also schedule an initial run.
 */
export function onAstroPageLoad(fn: () => void) {
  const run = () => fn();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    queueMicrotask(run);
  }

  document.addEventListener('astro:page-load', run);

  return () => {
    document.removeEventListener('astro:page-load', run);
  };
}

export function getThemeFromDocument(): ThemeName {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function onThemeChange(fn: (theme: ThemeName) => void) {
  const handler = () => fn(getThemeFromDocument());
  document.addEventListener('themechange', handler);
  return () => document.removeEventListener('themechange', handler);
}
