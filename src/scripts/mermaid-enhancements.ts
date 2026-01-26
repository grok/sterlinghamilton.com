type MermaidModule = {
  default: {
    initialize: (opts: Record<string, unknown>) => void;
    render: (id: string, source: string) => Promise<{ svg: string }>;
    run: (opts: { querySelector: string }) => Promise<void>;
  };
};

declare global {
  interface Window {
    __sterlingMermaidBound?: boolean;
    __sterlingMermaidModule?: MermaidModule['default'];
  }
}

const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function themeForMermaid() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function catppuccinMermaidTheme() {
  // Use existing design tokens (Catppuccin Latte/Mocha) from global.css
  const bg = cssVar('--bg');
  const text = cssVar('--text-primary');
  const text3 = cssVar('--text-tertiary');
  const s0 = cssVar('--surface0');
  const s1 = cssVar('--surface1');
  const s2 = cssVar('--surface2');
  const border = cssVar('--border');
  const sans = cssVar('--sans') || 'system-ui, -apple-system, sans-serif';

  const dark = themeForMermaid() === 'dark';

  return {
    theme: 'base',
    themeVariables: {
      fontFamily: sans,

      // Canvas
      background: bg,

      // Nodes
      primaryColor: s0,
      primaryTextColor: text,
      primaryBorderColor: border,

      secondaryColor: s1,
      secondaryTextColor: text,
      secondaryBorderColor: border,

      tertiaryColor: s2,
      tertiaryTextColor: text,
      tertiaryBorderColor: border,

      // Lines
      lineColor: text3 || border,

      // Text/labels
      textColor: text,

      // Slightly stronger contrast for dark mode
      nodeBorder: border,
      clusterBkg: dark ? s0 : s1,
      clusterBorder: border,
      edgeLabelBackground: bg,
    },
  };
}

async function getMermaid() {
  if (window.__sterlingMermaidModule) return window.__sterlingMermaidModule;
  const mod = (await import(MERMAID_CDN)) as unknown as MermaidModule;
  window.__sterlingMermaidModule = mod.default;
  return window.__sterlingMermaidModule;
}

function hasMermaidContent() {
  return Boolean(document.querySelector('pre[data-language="mermaid"]'));
}

function getOrCreateMermaidDialog() {
  let dialog = document.getElementById('mermaid-dialog');
  if (dialog instanceof HTMLDialogElement) return dialog;

  dialog = document.createElement('dialog');
  dialog.id = 'mermaid-dialog';
  dialog.className = 'mermaid-dialog';
  dialog.innerHTML = `
    <div class="mermaid-dialog__bar">
      <button type="button" class="mermaid-dialog__close" aria-label="Close diagram" title="Close">
        Close
      </button>
    </div>
    <div class="mermaid-dialog__content" data-mermaid-dialog-content></div>
  `;
  document.body.appendChild(dialog);

  const closeBtn = dialog.querySelector('.mermaid-dialog__close');
  closeBtn?.addEventListener('click', () => (dialog as HTMLDialogElement).close());

  // Click outside content closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) (dialog as HTMLDialogElement).close();
  });

  return dialog as HTMLDialogElement;
}

async function renderMermaidInto(mermaid: Awaited<ReturnType<typeof getMermaid>>, container: HTMLElement, source: string) {
  if (!source) return;

  // Mermaid likes stable ids per render.
  const id = `mermaid-fullscreen-${Math.random().toString(36).slice(2)}`;

  // Ensure mermaid is initialized with current theme vars.
  const themed = catppuccinMermaidTheme();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    ...themed,
  });

  try {
    const { svg } = await mermaid.render(id, source);
    container.innerHTML = svg;
  } catch (e) {
    container.innerHTML = '';
    const pre = document.createElement('pre');
    pre.textContent = source;
    container.appendChild(pre);
    console.log('[mermaid] fullscreen render error', e);
  }
}

let mermaidFullscreenOpener: HTMLElement | null = null;

async function openMermaidFullscreen(mermaid: Awaited<ReturnType<typeof getMermaid>>, source: string, title = 'Diagram', openerEl?: HTMLElement) {
  const dialog = getOrCreateMermaidDialog();
  const container = dialog.querySelector('[data-mermaid-dialog-content]');
  if (!(container instanceof HTMLElement)) return;

  mermaidFullscreenOpener = openerEl instanceof HTMLElement ? openerEl : null;

  dialog.setAttribute('aria-label', title);
  if (!dialog.open) dialog.showModal();

  // Render after the dialog is laid out, so we get correct dimensions.
  requestAnimationFrame(() => {
    renderMermaidInto(mermaid, container, source);
  });

  // Re-render if the dialog content area resizes (e.g. viewport changes).
  if (!dialog.dataset.mermaidResizeBound) {
    dialog.dataset.mermaidResizeBound = 'true';
    let raf = 0;
    const ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const openContainer = dialog.querySelector('[data-mermaid-dialog-content]');
        if (!(openContainer instanceof HTMLElement)) return;
        const s = dialog.dataset.mermaidSource || '';
        renderMermaidInto(mermaid, openContainer, s);
      });
    });
    ro.observe(container);

    dialog.addEventListener('close', () => {
      delete dialog.dataset.mermaidSource;
      const openContainer = dialog.querySelector('[data-mermaid-dialog-content]');
      if (openContainer instanceof HTMLElement) openContainer.innerHTML = '';
      ro.disconnect();

      // <dialog> restores focus to the opener by default, which keeps :focus-within true on the diagram wrapper.
      // Move focus away so the fullscreen button hides until you hover again.
      try {
        mermaidFullscreenOpener?.blur?.();
        const escape = document.querySelector('[data-focus-escape]');
        if (escape instanceof HTMLElement) {
          // Avoid jumping the reader back to the top of the page.
          escape.focus({ preventScroll: true });
        }
      } catch {
        // no-op
      } finally {
        mermaidFullscreenOpener = null;
      }
    });
  }

  dialog.dataset.mermaidSource = source;
}

function ensureMermaidContainers() {
  // Find candidate <pre> blocks first (both legacy and Expressive Code output).
  const pres = Array.from(document.querySelectorAll('pre[data-language="mermaid"]'));

  for (const pre of pres) {
    if (!(pre instanceof HTMLElement)) continue;
    if (pre.closest('.mermaid-block')) continue;

    // Expressive Code renders each line as `.ec-line` with a `.gutter` (line numbers)
    // and a `.code` cell. Extract only the code cell text to avoid polluting Mermaid
    // source with line numbers like `1flowchart TD2...`.
    const ecLineCodes = Array.from(pre.querySelectorAll('.ec-line .code'));
    const source =
      ecLineCodes.length > 0
        ? ecLineCodes
            .map((el) => (el.textContent || '').replace(/\s+$/g, ''))
            .join('\n')
            .trim()
        : (pre.textContent || '').replace(/^\n+|\n+$/g, '');
    if (!source) continue;

    const expressiveWrapper = pre.closest('.expressive-code');
    const replaceNode = expressiveWrapper instanceof HTMLElement ? expressiveWrapper : pre;

    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-block';

    const div = document.createElement('div');
    div.className = 'mermaid';
    div.dataset.mermaidSource = source;
    div.textContent = source;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mermaid-fullscreen';
    btn.setAttribute('aria-label', 'View diagram full screen');
    btn.setAttribute('title', 'View full screen');
    btn.setAttribute('aria-disabled', 'true');
    btn.innerHTML = `
      <svg viewBox="-5 -10 110 135" aria-hidden="true">
        <path
          fill="currentColor"
          d="m91.668 12.5v20.832c0 2.3008-1.8633 4.168-4.168 4.168s-4.168-1.8672-4.168-4.168v-16.664h-16.668c-2.3047 0-4.168-1.8672-4.168-4.168s1.8633-4.168 4.168-4.168h20.832c2.3086 0 4.1719 1.8672 4.1719 4.168zm-58.336 70.832h-16.664v-16.668c0-2.3047-1.8672-4.168-4.168-4.168s-4.168 1.8633-4.168 4.168v20.832c0 2.3047 1.8672 4.168 4.168 4.168h20.832c2.3008 0 4.168-1.8633 4.168-4.168 0-2.3008-1.8672-4.1641-4.168-4.1641zm0-75h-20.832c-2.3008 0-4.168 1.8672-4.168 4.168v20.832c0 2.3008 1.8672 4.168 4.168 4.168s4.168-1.8672 4.168-4.168v-16.664h16.668c2.3008 0 4.168-1.8672 4.168-4.168-0.003906-2.3008-1.8711-4.168-4.1719-4.168zm54.168 54.168c-2.3047 0-4.168 1.8633-4.168 4.168v16.668h-16.668c-2.3047 0-4.168 1.8633-4.168 4.168 0 2.3047 1.8633 4.168 4.168 4.168h20.832c2.3047 0 4.168-1.8633 4.168-4.168v-20.832c0.003907-2.3086-1.8594-4.1719-4.1641-4.1719z"
        />
      </svg>
    `;

    btn.addEventListener('click', async () => {
      if (btn.getAttribute('aria-disabled') === 'true') return;
      const source = div.dataset.mermaidSource || '';
      const mermaid = await getMermaid();
      openMermaidFullscreen(mermaid, source, 'Diagram', btn);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(div);

    replaceNode.replaceWith(wrapper);
  }
}

async function renderMermaid() {
  if (!hasMermaidContent()) return;

  ensureMermaidContainers();

  const has = document.querySelector('.mermaid');
  if (!has) return;

  const mermaid = await getMermaid();

  // Reset to source before re-rendering (theme toggles, navigations)
  document.querySelectorAll('.mermaid').forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    el.innerHTML = '';
    // Mermaid uses this flag to avoid re-processing; clear it so theme toggles can re-render.
    el.removeAttribute('data-processed');
    el.textContent = el.dataset.mermaidSource || '';
  });

  const themed = catppuccinMermaidTheme();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    ...themed,
  });

  try {
    await mermaid.run({ querySelector: '.mermaid' });

    // Enable fullscreen buttons now that SVG exists
    document.querySelectorAll('.mermaid-block').forEach((block) => {
      if (!(block instanceof HTMLElement)) return;
      const btn = block.querySelector('.mermaid-fullscreen');
      const svg = block.querySelector('.mermaid svg');
      if (btn instanceof HTMLButtonElement) {
        btn.setAttribute('aria-disabled', svg instanceof SVGElement ? 'false' : 'true');
      }
    });
  } catch (e) {
    console.log('[mermaid] render error', e);
  }
}

export function initMermaidEnhancements() {
  if (window.__sterlingMermaidBound) return;
  window.__sterlingMermaidBound = true;

  document.addEventListener('astro:page-load', () => {
    renderMermaid();
  });

  document.addEventListener('themechange', () => {
    // Wait a tick so the <html> class has updated before we read CSS vars.
    requestAnimationFrame(() => renderMermaid());
  });
}

export {};

