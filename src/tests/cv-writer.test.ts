import { describe, it, expect } from 'vitest';
import { createCvWriter, MARGIN } from '../lib/cv-pdf/writer';
import { PAGE, recordingDocument } from './fakes/recording-document';

const BLOCK = 40;
const BOTTOM = PAGE.height - MARGIN;

function writerAt(y: number) {
  const { doc, calls } = recordingDocument();
  doc.y = y;
  return { writer: createCvWriter(doc), addedPages: () => calls.filter(([name]) => name === 'addPage').length };
}

describe('viñetas y filas de título no quedan cortadas al pie de la página', () => {
  const NEAR_BOTTOM = BOTTOM - 10;

  // The first thing drawn, ignoring the cursor placement the test itself does.
  function firstDrawCall(draw: (writer: ReturnType<typeof createCvWriter>) => void): string {
    const { doc, calls } = recordingDocument();
    doc.y = NEAR_BOTTOM;
    draw(createCvWriter(doc));
    return calls.filter(([call]) => call !== 'set')[0][0];
  }

  it('una viñeta que no entra empieza en la página siguiente', () => {
    expect(firstDrawCall((writer) => writer.bullet('Built and maintain Node.js microservices.'))).toBe('addPage');
  });

  it('una fila de título que no entra empieza en la página siguiente', () => {
    expect(firstDrawCall((writer) => writer.titleRow('Senior Full-Stack Developer', 'Apr 2022 – Present'))).toBe('addPage');
  });
});

describe('CvWriter.ensure: salto de página (R-29)', () => {
  it('un bloque que entra justo hasta el borde inferior queda en la misma página', () => {
    const { writer, addedPages } = writerAt(BOTTOM - BLOCK);
    writer.ensure(BLOCK);
    expect(addedPages()).toBe(0);
  });

  it('un bloque que se pasa del borde inferior empieza una página nueva', () => {
    const { writer, addedPages } = writerAt(BOTTOM - BLOCK + 1);
    writer.ensure(BLOCK);
    expect(addedPages()).toBe(1);
  });
});
