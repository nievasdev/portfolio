// Text shaping for the CV: pure functions, no drawing.

export interface TextRun {
  text: string;
  bold: boolean;
}

const BOLD_RUN = /(\*\*.+?\*\*)/;
const BOLD_MARK = '**';
const LEADING_PUNCTUATION = /^[.,;:]+/;

// "https://www.linkedin.com/in/x/" → "linkedin.com/in/x": how a link reads on paper.
export function displayUrl(url: string): string {
  return url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// "2022-04" → "Apr 2022", with the month names of the CV's language.
export function formatMonth(yearMonth: string, months: string[]): string {
  const [year, month] = yearMonth.split('-');
  return `${months[Number(month) - 1]} ${year}`;
}

// "**metric**" → bold run, everything else regular. Punctuation right after a bold run
// joins it, so a line break can never leave a lone "." at the start of a line.
export function segments(text: string): TextRun[] {
  const runs: TextRun[] = [];
  for (const piece of text.split(BOLD_RUN).filter(Boolean)) {
    if (piece.startsWith(BOLD_MARK)) {
      runs.push({ text: piece.slice(BOLD_MARK.length, -BOLD_MARK.length), bold: true });
      continue;
    }
    appendPlain(runs, piece);
  }
  return runs;
}

function appendPlain(runs: TextRun[], piece: string): void {
  const previous = runs[runs.length - 1];
  const punctuation = piece.match(LEADING_PUNCTUATION)?.[0];
  if (!previous?.bold || !punctuation) {
    runs.push({ text: piece, bold: false });
    return;
  }
  previous.text += punctuation;
  if (piece.length > punctuation.length) runs.push({ text: piece.slice(punctuation.length), bold: false });
}
