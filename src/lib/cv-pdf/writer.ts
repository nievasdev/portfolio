// Facade over PDFKit: the layout pieces the CV is made of (section heads, bullets, title rows),
// so sections describe *what* goes on the page and never handle PDFKit primitives directly.
import { segments } from './format';
import type { CvDocument } from './types';

export const MARGIN = 50;

// Same palette as the site (light theme) so the PDF reads as part of it.
export const COLOR = { text: '#1E2A44', muted: '#5B6478', line: '#DDE1E8', gold: '#C9A227' } as const;

export const FONT = { mono: 'Mono', monoBold: 'MonoBold', sans: 'Helvetica', sansBold: 'Helvetica-Bold' } as const;

export const SIZE = { name: 22, small: 8.5, label: 8, body: 9.5, title: 10.5, tags: 7.5 } as const;

export const LINE_GAP = 1.5;

const SECTION = { keep: 40, headRoom: 30, gapLines: 0.6, ruleOffset: 6, ruleGap: 8, ruleWidth: 0.6 } as const;
const BULLET = { keep: 28, dashFrom: 4, dashTo: 9, dashY: 5.5, dashWidth: 0.7, indent: 16, afterLines: 0.25 } as const;
const TITLE_ROW = { keep: 48, metaNudge: 1, metaColumn: 140 } as const;

export interface CvWriter {
  readonly doc: CvDocument;
  readonly left: number;
  readonly width: number;
  // Starts a new page when `space` points would not fit on this one.
  ensure(space: number): void;
  // A lowercase heading with a gold dot and a rule; `keep` is the height that must fit with it.
  sectionHead(label: string, keep?: number): void;
  bullet(text: string): void;
  // Title on the left, meta right-aligned on the same line.
  titleRow(title: string, meta: string): void;
}

export function createCvWriter(doc: CvDocument): CvWriter {
  const left = MARGIN;
  const width = doc.page.width - MARGIN * 2;

  const ensure = (space: number) => {
    if (doc.y + space > doc.page.height - MARGIN) doc.addPage();
  };

  const sectionHead = (label: string, keep: number = SECTION.keep) => {
    ensure(keep + SECTION.headRoom);
    doc.moveDown(SECTION.gapLines);
    const y = doc.y;
    const heading = label.toLowerCase();
    doc.font(FONT.mono).fontSize(SIZE.body).fillColor(COLOR.text).text(heading, left, y, { continued: true });
    doc.fillColor(COLOR.gold).text('.');
    const ruleStart = left + doc.font(FONT.mono).fontSize(SIZE.body).widthOfString(`${heading}.`) + SECTION.ruleGap;
    const ruleY = y + SECTION.ruleOffset;
    doc.moveTo(ruleStart, ruleY).lineTo(left + width, ruleY).lineWidth(SECTION.ruleWidth).strokeColor(COLOR.line).stroke();
    doc.x = left;
    doc.moveDown(SECTION.gapLines);
  };

  // A paragraph whose **metrics** are bold, starting at `x`.
  const richLine = ({ text, x, lineWidth }: { text: string; x: number; lineWidth: number }) => {
    const runs = segments(text);
    doc.fontSize(SIZE.body).fillColor(COLOR.text);
    runs.forEach((run, i) => {
      const continued = i < runs.length - 1;
      doc.font(run.bold ? FONT.sansBold : FONT.sans);
      if (i === 0) doc.text(run.text, x, doc.y, { width: lineWidth, continued, lineGap: LINE_GAP });
      else doc.text(run.text, { continued, lineGap: LINE_GAP });
    });
  };

  const bullet = (text: string) => {
    ensure(BULLET.keep);
    const y = doc.y;
    const dashY = y + BULLET.dashY;
    doc.moveTo(left + BULLET.dashFrom, dashY).lineTo(left + BULLET.dashTo, dashY)
      .lineWidth(BULLET.dashWidth).strokeColor(COLOR.muted).stroke();
    doc.y = y;
    richLine({ text, x: left + BULLET.indent, lineWidth: width - BULLET.indent });
    doc.moveDown(BULLET.afterLines);
  };

  const titleRow = (title: string, meta: string) => {
    ensure(TITLE_ROW.keep);
    const y = doc.y;
    doc.font(FONT.mono).fontSize(SIZE.small).fillColor(COLOR.muted)
      .text(meta, left, y + TITLE_ROW.metaNudge, { width, align: 'right' });
    doc.font(FONT.sansBold).fontSize(SIZE.title).fillColor(COLOR.text)
      .text(title, left, y, { width: width - TITLE_ROW.metaColumn });
  };

  return { doc, left, width, ensure, sectionHead, bullet, titleRow };
}
