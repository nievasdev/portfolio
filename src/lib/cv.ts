import PDFDocument from 'pdfkit';
import { resolve } from 'node:path';
import { ui, links, type Lang } from '../i18n/ui';
import { yearsOfExperience } from './experience';
import type { Cv, Work } from '../content/schemas';

// Same palette as the site (light theme) so the PDF reads as part of it.
const C = { text: '#1E2A44', muted: '#5B6478', line: '#DDE1E8', gold: '#C9A227' };
const MONO = 'Mono';
const MONO_BOLD = 'MonoBold';
const SANS = 'Helvetica';
const SANS_BOLD = 'Helvetica-Bold';
const MARGIN = 50;
const BRACE = 'M-58.9,-34 L-50,-34 Q-42,-34 -42,-26 L-42,-8 Q-42,0 -34,0 Q-42,0 -42,8 L-42,26 Q-42,34 -50,34 L-58.9,34';

export interface CvInput {
  lang: Lang;
  cv: Cv;
  works: Work[];
  years?: number;
  // Tests turn compression off to search the PDF text.
  compress?: boolean;
}

export function formatMonth(ym: string, months: string[]): string {
  const [y, m] = ym.split('-');
  return `${months[Number(m) - 1]} ${y}`;
}

// "**metric**" → bold run, everything else regular. Punctuation right after a bold run
// joins it, so a line break can never leave a lone "." at the start of a line.
export function segments(text: string): { text: string; bold: boolean }[] {
  const out: { text: string; bold: boolean }[] = [];
  for (const s of text.split(/(\*\*.+?\*\*)/).filter(Boolean)) {
    if (s.startsWith('**')) {
      out.push({ text: s.slice(2, -2), bold: true });
      continue;
    }
    const prev = out[out.length - 1];
    const punct = s.match(/^[.,;:]+/)?.[0];
    if (prev?.bold && punct) {
      prev.text += punct;
      if (s.length > punct.length) out.push({ text: s.slice(punct.length), bold: false });
    } else {
      out.push({ text: s, bold: false });
    }
  }
  return out;
}

export function buildCv({ lang, cv, works, years = yearsOfExperience, compress = true }: CvInput): Promise<Buffer> {
  const t = ui[lang];
  const doc = new PDFDocument({
    size: 'A4',
    margin: MARGIN,
    compress,
    info: { Title: `Mauro Nievas — CV`, Author: 'Mauro Nievas', Subject: cv.headline },
  });
  // WOFF, not WOFF2: fontkit cannot subset WOFF2 when embedding.
  const fonts = resolve(process.cwd(), 'src/assets/fonts');
  doc.registerFont(MONO, `${fonts}/jetbrains-mono-latin-400.woff`);
  doc.registerFont(MONO_BOLD, `${fonts}/jetbrains-mono-latin-600.woff`);

  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((ok) => doc.on('end', () => ok(Buffer.concat(chunks))));

  const left = MARGIN;
  const width = doc.page.width - MARGIN * 2;
  const bottom = () => doc.page.height - MARGIN;
  const ensure = (space: number) => { if (doc.y + space > bottom()) doc.addPage(); };

  // ---- header: mark + name
  const top = MARGIN;
  doc.save().translate(left + 17, top + 17).scale(0.22);
  for (const a of [270, 30, 150]) {
    doc.save().rotate(a).path(BRACE).lineWidth(8).strokeColor(C.text).stroke().restore();
  }
  doc.circle(0, 0, 8.5).fill(C.gold).restore();

  doc.font(MONO_BOLD).fontSize(22).fillColor(C.text).text('Mauro Nievas', left + 48, top + 2, { lineBreak: false });
  doc.font(MONO).fontSize(8.5).fillColor(C.muted).text(cv.headline, left + 48, top + 30, { width: width - 48 });

  // contact line
  doc.moveDown(0.5);
  const contact: [string, string | undefined][] = [
    [cv.location, undefined],
    [cv.phone, `tel:${cv.phone.replace(/\s/g, '')}`],
    [links.email, `mailto:${links.email}`],
    [links.linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''), links.linkedin],
    ['nievas.dev', lang === 'es' ? 'https://nievas.dev/es' : 'https://nievas.dev'],
  ];
  doc.font(SANS).fontSize(8.5).fillColor(C.text);
  doc.x = left + 48;
  contact.forEach(([label, link], i) => {
    const last = i === contact.length - 1;
    doc.fillColor(C.text).text(label, { link, continued: true, underline: false });
    if (!last) doc.fillColor(C.muted).text('  ·  ', { continued: true });
    else doc.text('');
  });
  doc.x = left;
  doc.moveDown(1.6);

  // ---- helpers
  // `keep` is the height that must fit with the head, so short sections never split across pages.
  const sectionHead = (label: string, keep = 40) => {
    ensure(keep + 30);
    doc.moveDown(0.6);
    const y = doc.y;
    doc.font(MONO).fontSize(9.5).fillColor(C.text).text(label.toLowerCase(), left, y, { continued: true });
    doc.fillColor(C.gold).text('.');
    const end = left + doc.font(MONO).fontSize(9.5).widthOfString(`${label.toLowerCase()}.`) + 8;
    doc.moveTo(end, y + 6).lineTo(left + width, y + 6).lineWidth(0.6).strokeColor(C.line).stroke();
    doc.x = left;
    doc.moveDown(0.6);
  };

  const richLine = (text: string, x: number, w: number, size = 9.5) => {
    const parts = segments(text);
    doc.fontSize(size).fillColor(C.text);
    parts.forEach((p, i) => {
      doc.font(p.bold ? SANS_BOLD : SANS);
      if (i === 0) doc.text(p.text, x, doc.y, { width: w, continued: i < parts.length - 1, lineGap: 1.5 });
      else doc.text(p.text, { continued: i < parts.length - 1, lineGap: 1.5 });
    });
  };

  const bullet = (text: string) => {
    ensure(28);
    const y = doc.y;
    doc.moveTo(left + 4, y + 5.5).lineTo(left + 9, y + 5.5).lineWidth(0.7).strokeColor(C.muted).stroke();
    doc.y = y;
    richLine(text, left + 16, width - 16);
    doc.moveDown(0.25);
  };

  // title on the left, meta right-aligned on the same line
  const titleRow = (title: string, meta: string) => {
    ensure(48);
    const y = doc.y;
    doc.font(MONO).fontSize(8.5).fillColor(C.muted).text(meta, left, y + 1, { width, align: 'right' });
    doc.font(SANS_BOLD).fontSize(10.5).fillColor(C.text).text(title, left, y, { width: width - 140 });
  };

  // ---- summary
  sectionHead(cv.labels.summary);
  doc.font(SANS).fontSize(9.5).fillColor(C.text)
    .text(cv.summary.replaceAll('{years}', String(years)), left, doc.y, { width, lineGap: 1.5 });

  // ---- experience
  sectionHead(cv.labels.experience);
  works.forEach((w, i) => {
    if (i > 0) doc.moveDown(1.1);
    const when = `${formatMonth(w.start, cv.months)} – ${w.end ? formatMonth(w.end, cv.months) : cv.labels.present}`;
    titleRow(`${w.role}`, when);
    doc.font(SANS).fontSize(9.5).fillColor(C.muted)
      .text(`${w.name}${w.via ? ` (${w.via})` : ''} · ${w.location}`, left, doc.y, { width });
    doc.moveDown(0.35);
    w.highlights.forEach(bullet);
    // non-breaking spaces keep multi-word names ("GitLab CI/CD", "Tailwind CSS") on one line
    const techs = w.technologies.map((n) => n.replace(/ /g, ' ')).join(' · ');
    doc.font(MONO).fontSize(7.5).fillColor(C.muted).text(techs, left + 16, doc.y + 1, { width: width - 16 });
  });

  // ---- projects
  sectionHead(cv.labels.projects);
  cv.projects.forEach((p) => {
    titleRow(`${p.name} · ${p.role}`, p.when);
    doc.font(SANS).fontSize(9.5).fillColor(C.text).text(p.text, left, doc.y + 2, { width, lineGap: 1.5 });
  });

  // ---- education
  sectionHead(cv.labels.education);
  cv.education.forEach((e) => {
    titleRow(e.title, e.when);
    doc.font(SANS).fontSize(9.5).fillColor(C.muted).text(e.school, left, doc.y, { width });
  });

  // ---- skills: the same stack as the site's About section
  sectionHead(cv.labels.skills, t.about.stack.length * 16);
  t.about.stack.forEach((s) => {
    ensure(16);
    const y = doc.y;
    doc.font(MONO).fontSize(8).fillColor(C.muted).text(s.label, left, y + 1, { width: 110 });
    doc.font(SANS).fontSize(9.5).fillColor(C.text).text(s.items, left + 120, y, { width: width - 120 });
    doc.moveDown(0.25);
  });

  // ---- languages
  sectionHead(cv.labels.languages);
  doc.font(SANS).fontSize(9.5).fillColor(C.text).text(cv.languages.join('  ·  '), left, doc.y, { width });

  // ---- references
  if (cv.references.length > 0) {
    sectionHead(cv.labels.references, cv.references.length * 16);
    cv.references.forEach((r) => {
      ensure(16);
      const details = [r.role, r.email, r.phone].filter(Boolean).join('  ·  ');
      doc.font(SANS_BOLD).fontSize(9.5).fillColor(C.text).text(r.name, left, doc.y, { continued: true });
      doc.font(SANS).fillColor(C.muted).text(`  ${details}`, { width });
      doc.moveDown(0.2);
    });
  }

  doc.end();
  return done;
}
