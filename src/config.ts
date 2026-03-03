import type { ThemeConfig } from './types';

export const themeConfig: ThemeConfig = {
  // SITE INFO ///////////////////////////////////////////////////////////////////////////////////////////
  site: {
    website: 'https://sterlinghamilton.com/', // Site domain
    name: 'Sterling Hamilton', // Stable site name (metadata, <title>, RSS, etc.)
    headerTitle: "Hello, I'm Sterling!", // Header wordmark text
    author: 'Sterling Hamilton', // Author name
    description: 'Software engineer writing about engineering, AI, and how to think clearly about both.', // Site description
    language: 'en-US', // Default language tag (BCP-47)
    defaultLocale: 'en', // Default URL locale
    locales: [
      { code: 'en', label: 'English', langTag: 'en-US' },
      { code: 'es', label: 'Español', langTag: 'es' },
    ],
  },

  // GENERAL SETTINGS ////////////////////////////////////////////////////////////////////////////////////
  general: {
    contentWidth: '55rem', // Content area width
    centeredLayout: true, // Use centered layout (false for left-aligned)
    themeToggle: true, // Show theme toggle button (uses system theme by default)
    postListDottedDivider: false, // Show dotted divider in post list
    footer: false, // Show footer
    fadeAnimation: true, // Enable fade animations
  },

  // DATE SETTINGS ///////////////////////////////////////////////////////////////////////////////////////
  date: {
    dateFormat: 'YYYY-MM-DD', // Date format: YYYY-MM-DD, MM-DD-YYYY, DD-MM-YYYY, MONTH DAY YYYY, DAY MONTH YYYY
    dateSeparator: '.', // Date separator: . - / (except for MONTH DAY YYYY and DAY MONTH YYYY)
    dateOnRight: true, // Date position in post list (true for right, false for left)
  },

  // POST SETTINGS ///////////////////////////////////////////////////////////////////////////////////////
  post: {
    readingTime: true, // Show reading time in posts
    toc: true, // Show table of contents (when there is enough page width)
    imageViewer: true, // Enable image viewer
    copyCode: true, // Enable copy button in code blocks
    linkCard: false, // Enable link card (requires adapter/runtime)
  },
};
