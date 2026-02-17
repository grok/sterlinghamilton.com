# Agent guide (Cursor)

This repo uses **Astro** and **Bun**.

## Mission: shared reality

We optimize for **shared reality** between you (human) and me (agent).

When something is ambiguous or "works on your machine but not mine", we prefer:

- **Executable checks**: `bun run check`, `bun run test:unit`, `bun run test:e2e`
- **Debug probes** (dev-only): small endpoints/scripts that expose the exact runtime inputs/outputs
- **Repro steps**: exact URL + locale + theme + steps
- **Screenshots last**: useful for UI taste, but not for logic/behavior verification

## Start here (every session)

- Read `prompts/README.md`.
- If the task matches a documented workflow, follow the relevant prompt in `prompts/` (source of truth).

## Tooling

- Use **Bun** (`bun`, `bunx`) instead of npm/yarn.
- Prefer existing scripts:
  - `bun dev`
  - `bun run check`
  - `bun run test:unit`
  - `bun run test:e2e`

## Testing notes (local)

### Unit tests (Vitest)

- **Run**: `bun run test:unit`
- **Where**: `tests/unit/**/*.test.ts`
- **Config**: `vitest.config.ts`

### E2E + visual regression (Playwright)

- **Run**: `bun run test:e2e`
- **Port**: Playwright uses a dedicated dev-server port (`http://localhost:4400`) via `playwright.config.ts`
- **Visual baselines**:
  - Update: `bunx playwright test tests/e2e/visual.spec.ts --update-snapshots`
  - Run (diff): `bunx playwright test tests/e2e/visual.spec.ts`

Notes:
- The repo scripts run tests with `env -u NO_COLOR ...` to avoid the `NO_COLOR`/`FORCE_COLOR` warning.
- The repo scripts run Playwright with `PLAYWRIGHT_BROWSERS_PATH=0` so browser installs are consistent.

## Coverage / completeness checkpoints

When adding features, ask "what could regress?" and cover at the right layer:

- **Unit**: locale parsing, content selection rules, URL transforms, pure helpers
- **E2E behavior**: language toggle stays on same page, contact icon disabled on contact, theme toggle doesn't break navigation
- **Visual**: home/contact/article in light+dark (snapshot tests)

## UI + i18n notes (learned)

- **Holistic translation**: UI chrome should translate too (wordmark title, tooltips, toasts, "back to top", Mermaid controls).
  - Canonical UI strings live in `src/utils/i18n.ts` (`getUiLabels()`).
  - Prefer using `getUiLabels(locale)` over hardcoded strings in components/scripts.
- **Astro transitions + CSS**: avoid page-scoped `<style>` blocks for styles that must be stable across navigations.
  - If a UI element can appear during transitions (e.g. empty-locale callout), put its styles in `src/styles/global.css` to prevent "flash then disappear" behavior.
- **Tests follow fixes**: if a bug is fixed (translation mismatch, flashing styles, tooltip text), add an assertion in Playwright/Vitest that would have failed before the fix.

## Commit messages

Use: `type(scope): message.`

- `type` + `scope` lowercase
- always include a scope (e.g. `ui`, `content`, `i18n`, `a11y`, `prompts`)
- end with a period

See `.cursor/rules/40-git-commits.mdc` for examples and workflow guidance.

## Cursor rules

Project rules live in `.cursor/rules/`.
