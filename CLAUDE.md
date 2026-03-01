# Claude Code guide for sterlinghamilton.com

Astro + Bun personal site. Read this before doing anything.

## Punctuation (hard rule)

Plain keyboard punctuation only in all copy (posts, docs, UI strings, comments).

- Em/en dashes (-- U+2014/U+2013): use `-` instead
- Curly quotes (U+201C/D, U+2018/9): use `"` and `'` instead
- Ellipsis (U+2026): use `...` instead

No exceptions. Check before committing any content edits.

## Specs (hard rule)

Before editing any utility in `src/utils/` or writing tests for one, check `specs/` for
a corresponding spec file. If none exists, write the spec first. No exceptions.

When a test and a spec disagree, the spec wins. Fix the test, not the spec.
If the spec is wrong, update the spec first and treat that as a deliberate contract change.

## Writing style (content work)

Read `prompts/writing-style.md` before editing or drafting any public-facing copy.
Short version: simple words, active voice, conversational, lead with the point.

## Package manager

Bun only. Use `bun` and `bunx` - not npm or yarn.

## Verification scripts

- `bun run check` - types + lint
- `bun run test:unit` - Vitest unit tests
- `bun run test:e2e` - Playwright E2E + visual regression

## Commit format

`type(scope): message.`

- lowercase type and scope, always include scope, end with a period
- types: feat, fix, docs, style, refactor, chore, perf, test, build, ci
- scopes: ui, content, post, i18n, a11y, testing, prompts, deps

## Key files

- `prompts/writing-style.md` - voice and micro-style rules
- `prompts/content-authoring.md` - post frontmatter, drafts, translations
- `AGENTS.md` - full agent guide (testing notes, UI/i18n learned patterns, VSDD process)
- `specs/` - behavioral contracts; read the relevant spec before editing a utility or writing tests
- `.cursor/rules/` - detailed rules by topic
