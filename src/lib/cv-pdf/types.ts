import type { Lang } from '../../i18n/ui';
import type { Cv, Work } from '../../content/schemas';

// What the CV says, in one language.
export interface CvContent {
  lang: Lang;
  cv: Cv;
  works: Work[];
  years: number;
}

// The PDFKit document the CV is drawn on (a recording fake in tests).
export type CvDocument = PDFKit.PDFDocument;
