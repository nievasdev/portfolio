// The CV as a PDF: builds the real document and draws the CV sections on it.
import PDFDocument from 'pdfkit';
import { resolve } from 'node:path';
import { yearsOfExperience } from './experience';
import { createCvWriter, FONT, MARGIN } from './cv-pdf/writer';
import { CV_SECTIONS } from './cv-pdf/sections';
import type { CvContent, CvDocument } from './cv-pdf/types';

export type { CvContent, CvDocument } from './cv-pdf/types';
export { displayUrl, formatMonth, segments } from './cv-pdf/format';

export interface CvInput extends Omit<CvContent, 'years'> {
  years?: number;
  // Tests turn compression off to search the PDF text.
  compress?: boolean;
}

// WOFF, not WOFF2: fontkit cannot subset WOFF2 when embedding.
const FONTS_DIR = resolve(process.cwd(), 'src/assets/fonts');

// Draws every section of the CV on `doc`, top to bottom, adding pages as needed.
export function renderCv(doc: CvDocument, content: CvContent): void {
  const writer = createCvWriter(doc);
  CV_SECTIONS.forEach((draw) => draw(writer, content));
}

// Creates the real PDF (fonts, metadata, output buffer) and draws the CV on it.
export function buildCv({ lang, cv, works, years = yearsOfExperience, compress = true }: CvInput): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margin: MARGIN,
    compress,
    info: { Title: 'Mauro Nievas — CV', Author: 'Mauro Nievas', Subject: cv.headline },
  });
  doc.registerFont(FONT.mono, `${FONTS_DIR}/jetbrains-mono-latin-400.woff`);
  doc.registerFont(FONT.monoBold, `${FONTS_DIR}/jetbrains-mono-latin-600.woff`);

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((finish) => doc.on('end', () => finish(Buffer.concat(chunks))));

  renderCv(doc, { lang, cv, works, years });
  doc.end();
  return done;
}
