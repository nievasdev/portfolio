// The CV, section by section. Each section draws itself through the writer; the CV is the
// ordered list at the bottom, so adding a section never touches the others.
import { ui, links } from '../../i18n/ui';
import { displayUrl, formatMonth } from './format';
import { COLOR, FONT, LINE_GAP, MARGIN, SIZE, type CvWriter } from './writer';
import type { CvContent } from './types';
import type { Work } from '../../content/schemas';

export type CvSection = (writer: CvWriter, content: CvContent) => void;

const BRACE = 'M-58.9,-34 L-50,-34 Q-42,-34 -42,-26 L-42,-8 Q-42,0 -34,0 Q-42,0 -42,8 L-42,26 Q-42,34 -50,34 L-58.9,34';
const MARK = { center: 17, scale: 0.22, angles: [270, 30, 150], stroke: 8, dot: 8.5 } as const;
const HEADER = { textIndent: 48, nameNudge: 2, headlineTop: 30, afterLines: 1.6, contactGapLines: 0.5 } as const;
const SEPARATOR = '  ·  ';
const TAG_SEPARATOR = ' · ';
const NON_BREAKING_SPACE = ' ';
const ROW_HEIGHT = 16;
const SKILLS = { labelWidth: 110, labelNudge: 1, itemsColumn: 120, afterLines: 0.25 } as const;
const WORK = { gapLines: 1.1, afterPlaceLines: 0.35, tagsIndent: 16, tagsNudge: 1 } as const;
const PROJECT_TEXT_NUDGE = 2;
const REFERENCE_AFTER_LINES = 0.2;
const SITE = { en: 'https://nievas.dev', es: 'https://nievas.dev/es' } as const;

// The logo mark (three braces around the gold dot) and the name.
const drawHeader: CvSection = ({ doc, left, width }, { cv }) => {
  const top = MARGIN;
  doc.save().translate(left + MARK.center, top + MARK.center).scale(MARK.scale);
  for (const angle of MARK.angles) {
    doc.save().rotate(angle).path(BRACE).lineWidth(MARK.stroke).strokeColor(COLOR.text).stroke().restore();
  }
  doc.circle(0, 0, MARK.dot).fill(COLOR.gold).restore();

  const textLeft = left + HEADER.textIndent;
  doc.font(FONT.monoBold).fontSize(SIZE.name).fillColor(COLOR.text)
    .text('Mauro Nievas', textLeft, top + HEADER.nameNudge, { lineBreak: false });
  doc.font(FONT.mono).fontSize(SIZE.small).fillColor(COLOR.muted)
    .text(cv.headline, textLeft, top + HEADER.headlineTop, { width: width - HEADER.textIndent });
};

// Location, phone, email, LinkedIn and the site, on one line under the name.
const drawContact: CvSection = ({ doc, left }, { lang, cv }) => {
  const contact: [string, string | undefined][] = [
    [cv.location, undefined],
    [cv.phone, `tel:${cv.phone.replace(/\s/g, '')}`],
    [links.email, `mailto:${links.email}`],
    [displayUrl(links.linkedin), links.linkedin],
    [displayUrl(SITE.en), SITE[lang]],
  ];
  doc.moveDown(HEADER.contactGapLines);
  doc.font(FONT.sans).fontSize(SIZE.small).fillColor(COLOR.text);
  doc.x = left + HEADER.textIndent;
  contact.forEach(([label, link], i) => {
    doc.fillColor(COLOR.text).text(label, { link, continued: true, underline: false });
    if (i < contact.length - 1) doc.fillColor(COLOR.muted).text(SEPARATOR, { continued: true });
    else doc.text('');
  });
  doc.x = left;
  doc.moveDown(HEADER.afterLines);
};

const drawSummary: CvSection = ({ doc, left, width, sectionHead }, { cv, years }) => {
  sectionHead(cv.labels.summary);
  doc.font(FONT.sans).fontSize(SIZE.body).fillColor(COLOR.text)
    .text(cv.summary.replaceAll('{years}', String(years)), left, doc.y, { width, lineGap: LINE_GAP });
};

function drawWork(writer: CvWriter, { work, content }: { work: Work; content: CvContent }): void {
  const { doc, left, width, titleRow, bullet } = writer;
  const { cv } = content;
  const until = work.end ? formatMonth(work.end, cv.months) : cv.labels.present;
  titleRow(work.role, `${formatMonth(work.start, cv.months)} – ${until}`);
  doc.font(FONT.sans).fontSize(SIZE.body).fillColor(COLOR.muted)
    .text(`${work.name}${work.via ? ` (${work.via})` : ''} · ${work.location}`, left, doc.y, { width });
  doc.moveDown(WORK.afterPlaceLines);
  work.highlights.forEach(bullet);
  // non-breaking spaces keep multi-word names ("GitLab CI/CD", "Tailwind CSS") on one line
  const tags = work.technologies.map((name) => name.replace(/ /g, NON_BREAKING_SPACE)).join(TAG_SEPARATOR);
  doc.font(FONT.mono).fontSize(SIZE.tags).fillColor(COLOR.muted)
    .text(tags, left + WORK.tagsIndent, doc.y + WORK.tagsNudge, { width: width - WORK.tagsIndent });
}

const drawExperience: CvSection = (writer, content) => {
  writer.sectionHead(content.cv.labels.experience);
  content.works.forEach((work, i) => {
    if (i > 0) writer.doc.moveDown(WORK.gapLines);
    drawWork(writer, { work, content });
  });
};

const drawProjects: CvSection = ({ doc, left, width, sectionHead, titleRow }, { cv }) => {
  sectionHead(cv.labels.projects);
  cv.projects.forEach((project) => {
    titleRow(`${project.name} · ${project.role}`, project.when);
    doc.font(FONT.sans).fontSize(SIZE.body).fillColor(COLOR.text)
      .text(project.text, left, doc.y + PROJECT_TEXT_NUDGE, { width, lineGap: LINE_GAP });
  });
};

const drawEducation: CvSection = ({ doc, left, width, sectionHead, titleRow }, { cv }) => {
  sectionHead(cv.labels.education);
  cv.education.forEach((degree) => {
    titleRow(degree.title, degree.when);
    doc.font(FONT.sans).fontSize(SIZE.body).fillColor(COLOR.muted).text(degree.school, left, doc.y, { width });
  });
};

// The same stack as the site's About section. Its head reserves the whole section, so no row
// ever needs its own page break.
const drawSkills: CvSection = ({ doc, left, width, sectionHead }, { lang, cv }) => {
  const { stack } = ui[lang].about;
  sectionHead(cv.labels.skills, stack.length * ROW_HEIGHT);
  stack.forEach((group) => {
    const y = doc.y;
    doc.font(FONT.mono).fontSize(SIZE.label).fillColor(COLOR.muted)
      .text(group.label, left, y + SKILLS.labelNudge, { width: SKILLS.labelWidth });
    doc.font(FONT.sans).fontSize(SIZE.body).fillColor(COLOR.text)
      .text(group.items, left + SKILLS.itemsColumn, y, { width: width - SKILLS.itemsColumn });
    doc.moveDown(SKILLS.afterLines);
  });
};

const drawLanguages: CvSection = ({ doc, left, width, sectionHead }, { cv }) => {
  sectionHead(cv.labels.languages);
  doc.font(FONT.sans).fontSize(SIZE.body).fillColor(COLOR.text).text(cv.languages.join(SEPARATOR), left, doc.y, { width });
};

// Like skills, the head reserves the whole section.
const drawReferences: CvSection = ({ doc, left, width, sectionHead }, { cv }) => {
  if (cv.references.length === 0) return;
  sectionHead(cv.labels.references, cv.references.length * ROW_HEIGHT);
  cv.references.forEach((reference) => {
    const details = [reference.role, reference.email, reference.phone].filter(Boolean).join(SEPARATOR);
    doc.font(FONT.sansBold).fontSize(SIZE.body).fillColor(COLOR.text).text(reference.name, left, doc.y, { continued: true });
    doc.font(FONT.sans).fillColor(COLOR.muted).text(`  ${details}`, { width });
    doc.moveDown(REFERENCE_AFTER_LINES);
  });
};

export const CV_SECTIONS: readonly CvSection[] = [
  drawHeader,
  drawContact,
  drawSummary,
  drawExperience,
  drawProjects,
  drawEducation,
  drawSkills,
  drawLanguages,
  drawReferences,
];
