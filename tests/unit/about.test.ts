import { describe, expect, it } from 'vitest';
import { pickAboutEntryByLang } from '@/utils/about';

describe('pickAboutEntryByLang', () => {
  it('picks es when available', () => {
    const entries = [
      { id: 'about', data: { lang: 'en' } },
      { id: 'aboutes', data: { lang: 'es' } },
    ];
    expect(pickAboutEntryByLang(entries, 'es')?.id).toBe('aboutes');
  });

  it('falls back to en when es missing', () => {
    const entries = [{ id: 'about', data: { lang: 'en' } }];
    expect(pickAboutEntryByLang(entries, 'es')?.id).toBe('about');
  });

  it('normalizes lang tags like es-ES', () => {
    const entries = [
      { id: 'about', data: { lang: 'en' } },
      { id: 'aboutes', data: { lang: 'es' } },
    ];
    expect(pickAboutEntryByLang(entries, 'es-ES')?.id).toBe('aboutes');
  });
});
