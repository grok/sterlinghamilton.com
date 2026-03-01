# Behavioral specs

This directory contains behavioral contracts for testable feature areas in this codebase.
They are the source of truth that tests are written against - not the other way around.

## What a spec is

A spec lists:

- What a function or module does (behaviors)
- What inputs and outputs to expect
- Edge cases and boundary conditions

A spec is not test code. It describes what the code must do.
Write the spec first. Then write tests that encode it. Then write the implementation.

## What a spec is not

A spec is not an implementation guide. It does not say how to do something.
It says what must be true.

## Files in this directory

- `about.md` - contract for `pickAboutEntryByLang`
- `client-events.md` - contracts for `onAstroPageLoad`, `getThemeFromDocument`, `onThemeChange`
- `content-routing.md` - URL structure, draft behavior, language routing rules
- `date-formatting.md` - contracts for `formatDate` and `SUPPORTED_DATE_FORMATS`
- `feeds.md` - RSS/Atom generation contracts
- `i18n.md` - contracts for `normalizeLocale`, `localeFromPathname`, `getUiLabels`
- `image-config.md` - `imageConfig` shape and invariants (no unit tests; config object only)
- `post-filtering.md` - contracts for `getFilteredPosts` and `getSortedFilteredPosts`

## Process

1. Write or update the relevant spec before editing a utility or writing tests.
2. Write failing tests that encode the spec behaviors.
3. Write the implementation until the tests pass.
4. Run adversarial review (`prompts/adversarial-review.md`) to find gaps.
5. Iterate until the adversary finds no real gaps.

See `AGENTS.md` for the full VSDD process description.
