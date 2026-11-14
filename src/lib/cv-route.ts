import { getEntry } from 'astro:content';
import { buildCv } from './cv';
import type { Lang } from '../i18n/ui';

// Shared by /cv.pdf and /es/cv.pdf: rendered at build time, so the years stay current on every deploy.
export async function cvResponse(lang: Lang): Promise<Response> {
  const cv = (await getEntry('cv', lang))!.data;
  const works = (await getEntry('works', lang))?.data ?? [];
  const pdf = await buildCv({ lang, cv, works });
  return new Response(new Uint8Array(pdf), {
    headers: { 'Content-Type': 'application/pdf' },
  });
}
