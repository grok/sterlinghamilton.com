type AboutEntryLike = {
  id: string;
  data?: {
    lang?: string;
  };
};

export function pickAboutEntryByLang<T extends AboutEntryLike>(
  entries: T[],
  lang: string,
  fallbackLang = 'en',
): T | undefined {
  const normalized = (lang || '').toLowerCase().startsWith('es') ? 'es' : 'en';
  const primary = entries.find((e) => (e.data?.lang || 'en') === normalized);
  if (primary) return primary;
  return entries.find((e) => (e.data?.lang || 'en') === fallbackLang);
}

