import { beforeEach, describe, expect, it, vi } from 'vitest';

// vi.hoisted creates a mutable config object that is injected before any imports resolve.
// This lets individual tests change separator/format without re-importing the module.
const mockConfig = vi.hoisted(() => ({
  themeConfig: {
    date: {
      dateFormat: 'YYYY-MM-DD' as string,
      dateSeparator: '.' as string,
    },
  },
}));

vi.mock('@/config', () => mockConfig);

import { SUPPORTED_DATE_FORMATS, formatDate } from '@/utils/date';

describe('formatDate', () => {
  // March 5, 2024 - single-digit month and day to exercise zero-padding
  const date = new Date(2024, 2, 5);

  beforeEach(() => {
    mockConfig.themeConfig.date.dateFormat = 'YYYY-MM-DD';
    mockConfig.themeConfig.date.dateSeparator = '.';
  });

  describe('format strings', () => {
    it('YYYY-MM-DD produces correct output', () => {
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024.03.05');
    });

    it('MM-DD-YYYY produces correct output', () => {
      expect(formatDate(date, 'MM-DD-YYYY')).toBe('03.05.2024');
    });

    it('DD-MM-YYYY produces correct output', () => {
      expect(formatDate(date, 'DD-MM-YYYY')).toBe('05.03.2024');
    });

    it('MONTH DAY YYYY wraps month in span', () => {
      expect(formatDate(date, 'MONTH DAY YYYY')).toBe(
        '<span class="month">Mar</span> 5 2024',
      );
    });

    it('DAY MONTH YYYY wraps month in span', () => {
      expect(formatDate(date, 'DAY MONTH YYYY')).toBe(
        '5 <span class="month">Mar</span> 2024',
      );
    });
  });

  it('unknown format falls back to YYYY-MM-DD', () => {
    expect(formatDate(date, 'INVALID')).toBe('2024.03.05');
  });

  it('no format argument uses themeConfig default', () => {
    mockConfig.themeConfig.date.dateFormat = 'MM-DD-YYYY';
    mockConfig.themeConfig.date.dateSeparator = '-';
    expect(formatDate(date)).toBe('03-05-2024');
  });

  it('single-digit months and days are zero-padded', () => {
    const jan7 = new Date(2024, 0, 7); // January 7 - both parts single-digit
    expect(formatDate(jan7, 'YYYY-MM-DD')).toBe('2024.01.07');
  });

  describe('separator behavior', () => {
    it('- separator applies to numeric formats', () => {
      mockConfig.themeConfig.date.dateSeparator = '-';
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-03-05');
    });

    it('. separator applies to numeric formats', () => {
      mockConfig.themeConfig.date.dateSeparator = '.';
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024.03.05');
    });

    it('/ separator applies to numeric formats', () => {
      mockConfig.themeConfig.date.dateSeparator = '/';
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024/03/05');
    });

    it('invalid separator falls back to .', () => {
      mockConfig.themeConfig.date.dateSeparator = '!';
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024.03.05');
    });

    it('MONTH DAY YYYY ignores separator', () => {
      mockConfig.themeConfig.date.dateSeparator = '-';
      expect(formatDate(date, 'MONTH DAY YYYY')).toBe(
        '<span class="month">Mar</span> 5 2024',
      );
    });

    it('DAY MONTH YYYY ignores separator', () => {
      mockConfig.themeConfig.date.dateSeparator = '-';
      expect(formatDate(date, 'DAY MONTH YYYY')).toBe(
        '5 <span class="month">Mar</span> 2024',
      );
    });
  });
});

describe('SUPPORTED_DATE_FORMATS', () => {
  it('contains all 5 format strings', () => {
    expect(SUPPORTED_DATE_FORMATS).toHaveLength(5);
    expect(SUPPORTED_DATE_FORMATS).toContain('YYYY-MM-DD');
    expect(SUPPORTED_DATE_FORMATS).toContain('MM-DD-YYYY');
    expect(SUPPORTED_DATE_FORMATS).toContain('DD-MM-YYYY');
    expect(SUPPORTED_DATE_FORMATS).toContain('MONTH DAY YYYY');
    expect(SUPPORTED_DATE_FORMATS).toContain('DAY MONTH YYYY');
  });
});
