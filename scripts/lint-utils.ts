/**
 * scripts/lint-utils.ts
 *
 * What:
 * - Shared helpers for repo lint scripts in `scripts/`.
 *
 * Why:
 * - We want lint scripts to be small and readable.
 * - Centralizing the "plumbing" avoids copy/paste drift.
 *
 * Notes:
 * - These helpers intentionally read only git-tracked files.
 * - `readTextFile()` skips binary files and very large files.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export function splitNullSeparated(buf: Buffer): string[] {
  return buf
    .toString('utf8')
    .split('\0')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function gitTrackedFiles(): string[] {
  const out = execSync('git ls-files -z', {
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return splitNullSeparated(out);
}

export function isProbablyText(buf: Buffer): boolean {
  // If there is a NUL byte, treat it as binary.
  return !buf.includes(0);
}

export type FileMatcherOptions = {
  allowedExtensions: Set<string>;
  allowedBasenames: Set<string>;
};

export function makeFileMatcher(opts: FileMatcherOptions) {
  return function shouldCheck(filePath: string): boolean {
    const base = path.basename(filePath);
    if (opts.allowedBasenames.has(base)) return true;
    return opts.allowedExtensions.has(path.extname(filePath));
  };
}

export type ReadTextOptions = {
  maxBytes?: number;
};

export function readTextFile(
  relPath: string,
  opts: ReadTextOptions = {},
): string | null {
  const abs = path.resolve(relPath);
  let buf: Buffer;
  try {
    buf = fs.readFileSync(abs);
  } catch {
    return null;
  }

  if (!isProbablyText(buf)) return null;
  if (buf.length > (opts.maxBytes ?? 2_000_000)) return null;

  return buf.toString('utf8');
}
