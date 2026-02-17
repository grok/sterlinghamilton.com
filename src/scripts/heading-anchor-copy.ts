const DEFAULT_SELECTOR = '.prose .content h2[id], .prose .content h3[id]';
import { getUiLabels, localeFromPathname } from '@/utils/i18n';

declare global {
  interface Window {
    __sterlingHeadingAnchorCopyBound?: boolean;
    toast?: (message: string, options?: unknown) => void;
  }
}

function ui() {
  return getUiLabels(localeFromPathname(window.location.pathname));
}

function scrollHeadingIntoView(heading: HTMLElement) {
  // Match what a real `#hash` page load does: bring the target heading into view.
  // Respect reduced motion.
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  heading.scrollIntoView({
    block: 'start',
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

async function copyHeadingLink(heading: HTMLElement) {
  const id = heading.id;
  if (!id) return;

  const url = new URL(window.location.href);
  url.hash = id;

  // Update the URL for shareability.
  history.replaceState(null, '', url);

  // Also scroll to simulate landing on the permalink.
  scrollHeadingIntoView(heading);

  const text = url.toString();

  try {
    await navigator.clipboard.writeText(text);
    window.toast?.(ui().copiedLink, { variant: 'success' });
    return;
  } catch {
    // Fall through to legacy copy below
  }

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    // Deprecated but still a useful fallback for older browsers.
    document.execCommand('copy');
    window.toast?.(ui().copiedLink, { variant: 'success' });
  } finally {
    document.body.removeChild(ta);
  }
}

function bindHeadingAnchorCopy(selector = DEFAULT_SELECTOR) {
  for (const heading of document.querySelectorAll(selector)) {
    if (!(heading instanceof HTMLElement)) continue;
    if (heading.dataset.anchorCopyBound === 'true') continue;

    heading.dataset.anchorCopyBound = 'true';
    heading.dataset.anchorCopy = 'true';
    heading.title = heading.title || ui().copyLink;

    heading.addEventListener('click', (e) => {
      // If the user is selecting text, don't hijack the click.
      const selection = window.getSelection?.()?.toString?.() ?? '';
      if (selection.trim().length > 0) return;

      // Avoid weirdness if the heading contains a link and the user clicked it.
      const target = e.target;
      if (target instanceof Element && target.closest('a')) return;

      copyHeadingLink(heading);
    });
  }
}

export function initHeadingAnchorCopy() {
  // This is called from the small Astro wrapper `src/components/widgets/HeadingAnchorCopy.astro`.
  // Rationale: keep templates clean, and ensure our navigation wiring stays consistent.
  if (window.__sterlingHeadingAnchorCopyBound) return;
  window.__sterlingHeadingAnchorCopyBound = true;

  document.addEventListener('astro:page-load', () => bindHeadingAnchorCopy());
  document.addEventListener('astro:after-swap', () => bindHeadingAnchorCopy());
  document.addEventListener('DOMContentLoaded', () => bindHeadingAnchorCopy());
}
