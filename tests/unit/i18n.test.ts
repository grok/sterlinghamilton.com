import { describe, expect, it } from 'vitest';
import { getUiLabels, localeFromPathname, normalizeLocale } from '@/utils/i18n';

describe('i18n utils', () => {
  it('normalizeLocale defaults to en', () => {
    expect(normalizeLocale()).toBe('en');
    expect(normalizeLocale('')).toBe('en');
    expect(normalizeLocale('fr')).toBe('en');
  });

  it('normalizeLocale recognizes es variants', () => {
    expect(normalizeLocale('es')).toBe('es');
    expect(normalizeLocale('es-ES')).toBe('es');
  });

  it('localeFromPathname reads first segment', () => {
    expect(localeFromPathname('/es/contact/')).toBe('es');
    expect(localeFromPathname('/en/contact/')).toBe('en');
    expect(localeFromPathname('/contact/')).toBe('en');
  });

  it('getUiLabels returns locale-specific strings', () => {
    expect(getUiLabels('en').index).toBe('index');
    expect(getUiLabels('es').index).toBe('índice');
    expect(getUiLabels('es').homeTitle).toContain('Sterling');
    expect(getUiLabels('en').chooseLanguage).toBe('Choose language');
    expect(getUiLabels('es').chooseLanguage).toBe('Elegir idioma');
  });
});
