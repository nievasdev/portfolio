import { describe, it, expect } from 'vitest';
import cvEn from '../content/cv/en.json';
import cvEs from '../content/cv/es.json';
import worksEn from '../content/works/en.json';
import worksEs from '../content/works/es.json';
import { cvSchema, type Work } from '../content/schemas';
import { renderCv } from '../lib/cv';
import { recordingDocument } from './fakes/recording-document';

const YEARS = 9;

function draw(lang: 'en' | 'es') {
  const { doc, calls } = recordingDocument();
  const cv = cvSchema.parse(lang === 'en' ? cvEn : cvEs);
  const works = (lang === 'en' ? worksEn : worksEs) as Work[];
  renderCv(doc, { lang, cv, works, years: YEARS });
  return calls;
}

describe('renderCv: maquetación estable (CA-29)', () => {
  // The approved drawing sequence lives in the snapshot file; any change to a text, font,
  // colour, size, position or page break changes it. Review the diff before updating it.
  it('dibuja el CV en inglés igual que la versión aprobada', () => {
    expect(draw('en')).toMatchSnapshot();
  });

  it('dibuja el CV en español igual que la versión aprobada', () => {
    expect(draw('es')).toMatchSnapshot();
  });

  it('agrega al menos una página cuando el contenido no entra en una', () => {
    expect(draw('en').filter(([name]) => name === 'addPage').length).toBeGreaterThan(0);
  });

  it('sin referencias no dibuja esa sección', () => {
    const { doc, calls } = recordingDocument();
    const cv = cvSchema.parse({ ...cvEn, references: [] });
    renderCv(doc, { lang: 'en', cv, works: worksEn as Work[], years: YEARS });
    expect(calls.some((call) => call.includes(cvEn.labels.references.toLowerCase()))).toBe(false);
  });
});
