import { describe, it, expect, beforeEach } from 'vitest';
import { setEntries } from './fakes/astro-content';
import { cvResponse, MissingCvContentError } from '../lib/cv-route';
import cvEn from '../content/cv/en.json';
import cvEs from '../content/cv/es.json';
import worksEn from '../content/works/en.json';

const PDF_SIGNATURE = '%PDF-';

async function bodyOf(response: Response): Promise<Buffer> {
  return Buffer.from(await response.arrayBuffer());
}

describe('cvResponse: el CV se sirve como PDF (CA-30)', () => {
  beforeEach(() => {
    setEntries({ 'cv/en': cvEn, 'cv/es': cvEs, 'works/en': worksEn });
  });

  it('responde con tipo application/pdf', async () => {
    const response = await cvResponse('en');
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
  });

  it('el cuerpo es un PDF', async () => {
    const body = await bodyOf(await cvResponse('en'));
    expect(body.subarray(0, PDF_SIGNATURE.length).toString()).toBe(PDF_SIGNATURE);
  });

  it('sin experiencia cargada para el idioma, igual genera el CV', async () => {
    const body = await bodyOf(await cvResponse('es'));
    expect(body.subarray(0, PDF_SIGNATURE.length).toString()).toBe(PDF_SIGNATURE);
  });

  it('sin el contenido del CV falla con un error que dice qué falta', async () => {
    setEntries({});
    await expect(cvResponse('es')).rejects.toThrow(MissingCvContentError);
    await expect(cvResponse('es')).rejects.toThrow('Falta el contenido del CV para "es" (src/content/cv/es.json)');
  });

  it('el CV con experiencia es más largo que el que no la tiene', async () => {
    const withWorks = await bodyOf(await cvResponse('en'));
    setEntries({ 'cv/en': cvEn });
    const withoutWorks = await bodyOf(await cvResponse('en'));
    expect(withWorks.length).toBeGreaterThan(withoutWorks.length);
  });
});
