export type LocaleCode = 'en' | 'es';

export type UiLabels = {
  index: string;
  top: string;
};

export function normalizeLocale(input?: string): LocaleCode {
  const v = (input || '').toLowerCase();
  if (v.startsWith('es')) return 'es';
  return 'en';
}

export function localeFromPathname(pathname: string): LocaleCode {
  const first = pathname.split('/').filter(Boolean)[0];
  return normalizeLocale(first);
}

export function getUiLabels(locale: string): UiLabels {
  const l = normalizeLocale(locale);
  if (l === 'es') {
    return { index: 'índice', top: 'Arriba' };
  }
  return { index: 'index', top: 'Top' };
}

