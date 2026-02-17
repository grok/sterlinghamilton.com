/**
 * scripts/lint-prose.ts
 *
 * What:
 * - Enforces our "plain keyboard punctuation only" rule across git-tracked files.
 *
 * Why:
 * - Keeps copy consistent and avoids smart punctuation and encoded punctuation.
 * - Helps the LLM (and humans) by turning writing conventions into a deterministic check.
 *
 * How:
 * - Check: `bun run lint:prose`
 * - Fix (conservative, prose-first files only): `bun run lint:prose:fix`
 *
 * Notes:
 * - Auto-fix is intentionally conservative because changing punctuation in code can break strings.
 * - See `.cursor/rules/35-plain-punctuation.mdc` for the human-facing rule.
 */

import fs from 'node:fs';
import path from 'node:path';
import { gitTrackedFiles, makeFileMatcher, readTextFile } from './lint-utils';

type Mode = 'check' | 'fix';

const mode: Mode = process.argv.includes('--fix') ? 'fix' : 'check';

const allowedExtensions = new Set([
  '.astro',
  '.css',
  '.js',
  '.json',
  '.md',
  '.mdc',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
  '.yaml',
]);

const allowedBasenames = new Set([
  '.cursorrules',
  '.editorconfig',
  '.gitignore',
  'AGENTS.md',
  'README.md',
]);

const shouldCheck = makeFileMatcher({
  allowedExtensions,
  allowedBasenames,
});

const SELF_PATH = path.normalize('scripts/lint-prose.ts');

function canAutoFix(filePath: string): boolean {
  // Auto-fixing punctuation in code can break string literals (for example: `don't` inside single quotes).
  // We keep `--fix` conservative and only auto-fix "prose-first" files.
  const ext = path.extname(filePath);
  if (ext === '.md' || ext === '.mdc' || ext === '.txt') return true;

  const base = path.basename(filePath);
  return base === 'README.md' || base === 'AGENTS.md';
}

type Replacement = {
  label: string;
  re: RegExp;
  replace: string;
};

// This enforces `.cursor/rules/35-plain-punctuation.mdc` at the code level.
const REPLACEMENTS: Replacement[] = [
  // Unicode punctuation -> ASCII
  { label: 'em/en dash', re: /[\u2013\u2014]/g, replace: '-' },
  { label: 'curly apostrophe', re: /[\u2018\u2019]/g, replace: "'" },
  { label: 'curly quotes', re: /[\u201C\u201D]/g, replace: '"' },
  { label: 'ellipsis', re: /\u2026/g, replace: '...' },
  { label: 'middle dot', re: /\u00B7/g, replace: '.' },

  // Encoded punctuation -> ASCII
  {
    label: 'encoded mdash and ndash',
    re: /&(m|n)d?ash;|&ndash;|&mdash;/gi,
    replace: '-',
  },
  { label: 'encoded ellipsis', re: /&hellip;/gi, replace: '...' },
  {
    label: 'encoded quotes',
    re: /&(l|r)dquo;|&(l|r)squo;/gi,
    replace: '"',
  },
  { label: 'encoded apostrophe', re: /&rsquo;|&lsquo;/gi, replace: "'" },
];

function findViolations(input: string): boolean {
  return REPLACEMENTS.some((r) => r.re.test(input));
}

function applyFixes(input: string): string {
  let out = input;
  for (const r of REPLACEMENTS) out = out.replace(r.re, r.replace);
  return out;
}

function main() {
  const files = gitTrackedFiles()
    .filter(shouldCheck)
    // This script contains patterns like "&ndash;" in regex source. Do not lint itself.
    .filter((p) => path.normalize(p) !== SELF_PATH);

  const offenders: string[] = [];
  let fixedCount = 0;

  for (const rel of files) {
    const before = readTextFile(rel);
    if (before === null) continue;
    if (!findViolations(before)) continue;

    if (mode === 'fix') {
      if (!canAutoFix(rel)) continue;
      const after = applyFixes(before);
      if (after !== before) {
        fs.writeFileSync(path.resolve(rel), after, 'utf8');
        fixedCount++;
      }
    } else {
      offenders.push(rel);
    }
  }

  if (mode === 'fix') {
    console.log(`[prose] fixed punctuation in ${fixedCount} file(s).`);
    return;
  }

  if (offenders.length > 0) {
    console.error(
      '[prose] non-plain punctuation found (see .cursor/rules/35-plain-punctuation.mdc):',
    );
    for (const f of offenders) console.error(`- ${f}`);
    process.exit(1);
  }
}

main();
