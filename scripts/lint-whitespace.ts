/**
 * scripts/lint-whitespace.ts
 *
 * What:
 * - Checks git-tracked text files for:
 *   - trailing whitespace
 *   - missing final newline
 *
 * Why:
 * - Keeps diffs clean and consistent across editors.
 * - Prevents "extra whitespace at end of file" churn.
 *
 * How:
 * - Check: `bun run lint:whitespace`
 * - Fix: `bun run lint:whitespace:fix`
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

function normalizeWhitespace(input: string): string {
  // Normalize line endings so "final newline" is consistent across platforms/editors.
  const lf = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = lf.split('\n').map((line) => line.replace(/[ \t]+$/g, ''));
  const body = lines.join('\n').replace(/\n*$/g, '');
  return body.length > 0 ? `${body}\n` : '\n';
}

function main() {
  const files = gitTrackedFiles().filter(shouldCheck);

  const changed: string[] = [];
  let fixedCount = 0;

  for (const rel of files) {
    const before = readTextFile(rel);
    if (before === null) continue;
    const after = normalizeWhitespace(before);

    if (before !== after) {
      changed.push(rel);
      if (mode === 'fix') {
        fs.writeFileSync(path.resolve(rel), after, 'utf8');
        fixedCount++;
      }
    }
  }

  if (mode === 'fix') {
    console.log(`[whitespace] fixed ${fixedCount} file(s).`);
    return;
  }

  if (changed.length > 0) {
    console.error(
      '[whitespace] trailing whitespace / final newline issues found:',
    );
    for (const f of changed) console.error(`- ${f}`);
    process.exit(1);
  }
}

main();
