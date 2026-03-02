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

## VSDD process

VSDD (Verified Spec-Driven Development) is the methodology used in this repo.
The short version: write the spec first, then tests, then code.

### When to write a spec

Before editing a utility or writing a test, read the relevant spec in `specs/`.
If no spec exists for the thing you are changing, write one first.

### The pipeline

1. **Spec** - write or update `specs/<feature>.md` describing behaviors, inputs/outputs, edge cases.
2. **Failing tests** - write unit tests in `tests/unit/` that encode the spec. Run them; they should fail.
3. **Implementation** - write or update `src/utils/` until the tests pass.
4. **Adversarial review** - hand the spec + tests + implementation to a second model using `prompts/adversarial-review.md`. It produces a gap report.
5. **Iterate** - address real gaps found. Repeat from step 1 or 4 as needed.

### Where specs live

`specs/` - one file per feature area. See `specs/README.md` for the full list.

### Spec vs. test conflicts

When a test and a spec disagree, the spec wins. Fix the test to match the spec.
If the spec is wrong, update the spec first - that is a deliberate contract change,
not a test fix.

### Convergence exit condition

Done when adversarial review finds no real gaps - only hypotheticals or invented scenarios.
The adversary writes "No real gaps found." You ship.

### Scope: utilities vs. UI

The VSDD pipeline above applies to `src/utils/`. For UI changes (components, pages, content), the equivalent discipline is:

- No placeholder `href` values pointing to resources that do not exist yet.
- No references to assets (`public/`, images, PDFs, external URLs) before the asset or page is live.
- Before shipping a UI change: verify every new link resolves and every new asset loads.

### Formal verification

Formal hardening (Kani, Dafny, TLA+) is skipped for this static blog.
Adversarial review is the last tier.

---

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
