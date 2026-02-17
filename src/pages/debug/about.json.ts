import { getCollection } from 'astro:content';
import { pickAboutEntryByLang } from '@/utils/about';

export async function GET() {
  if (import.meta.env.PROD) {
    return new Response('Not Found', { status: 404 });
  }

  const entries = await getCollection('about');
  const ids = entries.map((e) => e.id).sort();

  const picked = {
    en: pickAboutEntryByLang(entries, 'en')?.id ?? null,
    es: pickAboutEntryByLang(entries, 'es')?.id ?? null,
  };

  return new Response(
    JSON.stringify(
      {
        ids,
        picked,
        langs: entries.map((e) => ({ id: e.id, lang: e.data.lang })),
      },
      null,
      2,
    ),
    {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    },
  );
}
