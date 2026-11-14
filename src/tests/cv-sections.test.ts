import { describe, it, expect } from 'vitest';
import cvEn from '../content/cv/en.json';
import worksEn from '../content/works/en.json';
import { cvSchema, type Work } from '../content/schemas';
import { CV_SECTIONS, type CvSection } from '../lib/cv-pdf/sections';
import { createCvWriter, MARGIN } from '../lib/cv-pdf/writer';
import { PAGE, recordingDocument } from './fakes/recording-document';

const HEAD_ROOM = 30; // what a section head itself needs (writer.ts SECTION.headRoom)
const ONE_ROW = 16;
const BOTTOM = PAGE.height - MARGIN;

function section(name: string): CvSection {
  return CV_SECTIONS.find((draw) => draw.name === name)!;
}

// Places the cursor so the head and one row fit, but not the whole section.
function drawNearBottom(name: string) {
  const { doc, calls } = recordingDocument();
  doc.y = BOTTOM - HEAD_ROOM - ONE_ROW * 2;
  const content = { lang: 'en' as const, cv: cvSchema.parse(cvEn), works: worksEn as Work[], years: 9 };
  section(name)(createCvWriter(doc), content);
  const firstPageBreak = calls.findIndex(([call]) => call === 'addPage');
  const firstText = calls.findIndex(([call]) => call === 'text');
  return { firstPageBreak, firstText };
}

describe('secciones cortas enteras en una página (R-29)', () => {
  it('habilidades: si la sección no entra entera, empieza en la página siguiente', () => {
    const { firstPageBreak, firstText } = drawNearBottom('drawSkills');
    expect(firstPageBreak).toBeGreaterThanOrEqual(0);
    expect(firstPageBreak).toBeLessThan(firstText);
  });

  it('referencias: si la sección no entra entera, empieza en la página siguiente', () => {
    const { firstPageBreak, firstText } = drawNearBottom('drawReferences');
    expect(firstPageBreak).toBeGreaterThanOrEqual(0);
    expect(firstPageBreak).toBeLessThan(firstText);
  });
});
