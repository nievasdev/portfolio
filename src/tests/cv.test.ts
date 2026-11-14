import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';
import cvEn from '../content/cv/en.json';
import cvEs from '../content/cv/es.json';
import worksEn from '../content/works/en.json';
import worksEs from '../content/works/es.json';
import projectsEn from '../content/projects/en.json';
import { cvSchema, type Work } from '../content/schemas';
import { buildCv, displayUrl, formatMonth, segments } from '../lib/cv';
import { CAREER_START } from '../lib/experience';

// Uncompressed PDFs keep text runs as hex strings; decode them to search the content.
function pdfText(pdf: Buffer): string {
  const raw = pdf.toString('latin1');
  return [...raw.matchAll(/<([0-9a-f]+)>/gi)]
    .map(([, hex]) => Buffer.from(hex, 'hex').toString('latin1'))
    .join('');
}

describe('CV content', () => {
  it.each([['en', cvEn], ['es', cvEs]])('%s matches the CV schema', (_, cv) => {
    expect(cvSchema.parse(cv)).toBeTruthy();
  });

  it('rechaza un resumen sin el lugar para los años', () => {
    expect(cvSchema.safeParse({ ...cvEn, summary: 'Full-Stack Developer with many years.' }).success).toBe(false);
  });

  it('has the same shape in English and Spanish', () => {
    expect(cvEs.references.map((r) => [r.name, r.email, r.phone]))
      .toEqual(cvEn.references.map((r) => [r.name, r.email, r.phone]));
    expect(cvEs.projects.length).toBe(cvEn.projects.length);
    expect(cvEs.education.length).toBe(cvEn.education.length);
  });

  it('dates every work with ordered year-months', () => {
    worksEn.forEach((w: Partial<Work>) => {
      if (w.end) expect(w.end >= w.start!).toBe(true);
    });
    expect(worksEs.map((w) => [w.start, 'end' in w ? w.end : undefined]))
      .toEqual(worksEn.map((w) => [w.start, 'end' in w ? w.end : undefined]));
  });

  it('starts the career count at the earliest job', () => {
    const earliest = worksEn.map((w) => w.start).sort()[0];
    const start = `${CAREER_START.getFullYear()}-${String(CAREER_START.getMonth() + 1).padStart(2, '0')}`;
    expect(start).toBe(earliest);
  });

  it('ships every screenshot in both sizes', () => {
    projectsEn.flatMap((p) => ('screenshots' in p ? p.screenshots ?? [] : [])).forEach((s) => {
      for (const w of [600, 1200]) {
        expect(existsSync(resolve(__dirname, `../../public${s.src}-${w}.webp`)), `${s.src}-${w}`).toBe(true);
      }
    });
  });
});

describe('CV helpers', () => {
  it('formats year-months with localized month names', () => {
    expect(formatMonth('2022-04', cvEn.months)).toBe('Apr 2022');
    expect(formatMonth('2021-07', cvEs.months)).toBe('jul 2021');
  });

  it('muestra un link sin protocolo, sin www y sin barra final', () => {
    expect(displayUrl('https://www.linkedin.com/in/mauronievasdev/')).toBe('linkedin.com/in/mauronievasdev');
  });

  it('muestra un link sin www tal cual, sin protocolo', () => {
    expect(displayUrl('https://nievas.dev')).toBe('nievas.dev');
  });

  it('un texto que solo termina en ** no es negrita', () => {
    expect(segments('fin**')).toEqual([{ text: 'fin**', bold: false }]);
  });

  it('toda la puntuación seguida queda pegada a la negrita (CA-28)', () => {
    expect(segments('**40%**.. y')).toEqual([
      { text: '40%..', bold: true },
      { text: ' y', bold: false },
    ]);
  });

  it('splits bold runs and keeps trailing punctuation with them', () => {
    expect(segments('up to **40%**. Done')).toEqual([
      { text: 'up to ', bold: false },
      { text: '40%.', bold: true },
      { text: ' Done', bold: false },
    ]);
  });
});

describe('CV PDF', () => {
  it.each([['en', cvEn, worksEn], ['es', cvEs, worksEs]] as const)('builds a valid %s PDF', async (lang, cv, works) => {
    const pdf = await buildCv({ lang, cv: cvSchema.parse(cv), works: works as Work[], years: 9, compress: false });
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pdf.length).toBeGreaterThan(5000);
  });

  it('usa hoja A4 y declara título y autor del documento', async () => {
    const pdf = await buildCv({ lang: 'en', cv: cvSchema.parse(cvEn), works: worksEn as Work[], years: 9, compress: false });
    const raw = pdf.toString('latin1');
    expect(raw).toContain('/MediaBox [0 0 595.28 841.89]');
    expect(raw).toContain('/Title');
    expect(raw).toContain('/Author');
  });

  it('prints the computed years, the companies and the contact email', async () => {
    const pdf = await buildCv({ lang: 'en', cv: cvSchema.parse(cvEn), works: worksEn as Work[], years: 12, compress: false });
    const text = pdfText(pdf);
    expect(text).toContain('12+ years');
    ['Antel', 'Upshow', 'Hacknoid'].forEach((name) => expect(text).toContain(name));
    expect(pdf.toString('latin1')).toContain('mailto:mauro@nievas.dev');
  });
});
