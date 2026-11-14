import { getEntry } from 'astro:content';
import { buildCv } from './cv';
import type { Lang } from '../i18n/ui';

// The build cannot produce a CV without its content; say which entry is missing.
export class MissingCvContentError extends Error {
  constructor(lang: Lang) {
    super(`Falta el contenido del CV para "${lang}" (src/content/cv/${lang}.json)`);
    this.name = 'MissingCvContentError';
  }
}

// Shared by /cv.pdf and /es/cv.pdf: rendered at build time, so the years stay current on every deploy.
export async function cvResponse(lang: Lang): Promise<Response> {
  const cvEntry = await getEntry('cv', lang);
  if (!cvEntry) throw new MissingCvContentError(lang);
  const works = (await getEntry('works', lang))?.data ?? [];
  const pdf = await buildCv({ lang, cv: cvEntry.data, works });
  return new Response(new Uint8Array(pdf), {
    headers: { 'Content-Type': 'application/pdf' },
  });
}
