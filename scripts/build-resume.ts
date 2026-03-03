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
const logoSvg = readFileSync(resolve(root, 'public/assets/logo.svg'), 'utf-8');

const md = readFileSync(mdPath, 'utf-8');
const rawBody = await marked(md);

// Wrap each job block (h3 through the next h3/h2/end) in a .job div so
// break-inside: avoid keeps each position on one page.
// Restructure the header as a flex row: name/contact left, logo right.
const body = rawBody
  .replace(/(<h3>[\s\S]*?)(?=<h3>|<h2>|$)/g, '<div class="job">$1</div>')
  .replace(/<h1>([\s\S]*?)<\/h1>\s*<p>([\s\S]*?)<\/p>/, (_, name, contact) => {
    return `<div class="resume-header"><div class="resume-header-left"><h1>${name}</h1><p class="contact-line">${contact}</p></div><div class="resume-logo">${logoSvg}</div></div>`;
  });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 10.5pt;
      line-height: 1.4;
      color: #4c4f69; /* Catppuccin Latte: text */
    }

    h1 {
      font-size: 20pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #4c4f69; /* Catppuccin Latte: text */
      margin-bottom: 0.15rem;
    }

    /* Section headings */
    h2 {
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #8839ef; /* Catppuccin Latte: mauve */
      border-bottom: 0.5px solid #ccd0da; /* Catppuccin Latte: surface0 */
      padding-bottom: 0.15rem;
      margin-top: 1rem;
      margin-bottom: 0.4rem;
    }

    /* Skills section - metadata feel */
    h2:first-of-type + p,
    h2:first-of-type + p + p,
    h2:first-of-type + p + p + p {
      font-size: 8.5pt;
      color: #5c5f77; /* Catppuccin Latte: subtext1 */
      margin-bottom: 0.1rem;
    }

    /* Job block - keeps each position on one page */
    .job {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 1rem;
    }

    /* Job/school title */
    h3 {
      font-size: 9.5pt;
      font-weight: 600;
      color: #4c4f69; /* Catppuccin Latte: text */
      margin-bottom: 0.05rem;
    }

    /* Dates / subtitle */
    h4 {
      font-size: 8.5pt;
      font-weight: 400;
      color: #6c6f85; /* Catppuccin Latte: subtext0 */
      margin-bottom: 0.2rem;
    }

    p { margin-bottom: 0.25rem; }

    ul {
      padding-left: 1em;
      margin-bottom: 0.25rem;
    }

    li { margin-bottom: 0.1rem; }

    a {
      color: inherit;
      text-decoration: none;
    }

    strong { font-weight: 600; }

    /* Skills labels - darker than the list text so they read as labels */
    h2:first-of-type + p strong,
    h2:first-of-type + p + p strong,
    h2:first-of-type + p + p + p strong {
      color: #4c4f69; /* Catppuccin Latte: text */
    }

    /* Header: name/contact left, logo right */
    .resume-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0;
    }

    .resume-header-left {
      flex: 1;
      min-width: 0;
    }

    /* Contact line under name */
    p.contact-line {
      font-size: 8.5pt;
      color: #6c6f85; /* Catppuccin Latte: subtext0 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0;
    }

    p.contact-line a {
      color: #fe640b; /* Catppuccin Latte: peach */
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }

    .resume-logo {
      flex-shrink: 0;
      width: 40px;
      color: #4c4f69; /* Catppuccin Latte: text */
      margin-top: 0.25rem;
    }

    .resume-logo svg {
      width: 100%;
      height: auto;
      display: block;
    }
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
await page.pdf({
  path: outPath,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
});

await browser.close();
console.log('Resume PDF written to public/resume.pdf');
