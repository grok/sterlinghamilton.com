/**
 * Generates public/resume.pdf from src/content/resume.md.
 * Uses the Playwright Chromium already installed for E2E tests - no extra browser download.
 *
 * Usage: bun run build:resume
 */

import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { resolve } from 'path';

const root = process.cwd();
const mdPath = resolve(root, 'src/content/resume.md');
const outPath = resolve(root, 'public/resume.pdf');

const md = readFileSync(mdPath, 'utf-8');
const body = await marked(md);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.55;
      color: #1a1a1a;
      padding: 0.65in 0.75in;
    }

    h1 {
      font-size: 22pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.2rem;
    }

    /* Section headings */
    h2 {
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #666;
      border-bottom: 0.5px solid #bbb;
      padding-bottom: 0.2rem;
      margin-top: 1.1rem;
      margin-bottom: 0.5rem;
    }

    /* Job/school title */
    h3 {
      font-size: 10pt;
      font-weight: 600;
      margin-bottom: 0.1rem;
    }

    /* Dates / subtitle */
    h4 {
      font-size: 9pt;
      font-weight: 400;
      color: #555;
      margin-bottom: 0.3rem;
    }

    p { margin-bottom: 0.35rem; }

    ul {
      padding-left: 1.1em;
      margin-bottom: 0.4rem;
    }

    li { margin-bottom: 0.15rem; }

    a {
      color: inherit;
      text-decoration: none;
    }

    strong { font-weight: 600; }
  </style>
</head>
<body>
${body}
</body>
</html>`;

console.log('Launching browser...');
const browser = await chromium.launch();
const page = await browser.newPage();

await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({ path: outPath, format: 'Letter', printBackground: true });

await browser.close();
console.log('Resume PDF written to public/resume.pdf');
