import type { Work } from '../content/schemas';

export interface Segment {
  slug: string;
  name: string;
  // Position and width in % of the span from the first start to `now`.
  left: number;
  width: number;
  current: boolean;
}

const MONTHS_PER_YEAR = 12;
const MIN_MONTHS = 1;
const PRECISION = 10; // one decimal

// A month counter: only differences between two of them are ever used.
const monthOf = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-').map(Number);
  return year * MONTHS_PER_YEAR + month;
};

const monthOfDate = (date: Date) => date.getFullYear() * MONTHS_PER_YEAR + date.getMonth() + 1;

// One segment per job on a bar from the earliest start to today (oldest first).
export function timelineSegments(works: Work[], now: Date = new Date()) {
  const firstStart = works.map((w) => w.start).sort()[0];
  const start = monthOf(firstStart);
  const end = monthOfDate(now);
  const span = Math.max(MIN_MONTHS, end - start);
  const percent = (months: number) => Math.round((months / span) * 100 * PRECISION) / PRECISION;

  const segments: Segment[] = works
    .map((w) => {
      const from = monthOf(w.start);
      const to = w.end ? monthOf(w.end) : end;
      return {
        slug: w.slug,
        name: w.name,
        left: percent(from - start),
        width: percent(Math.max(MIN_MONTHS, to - from)),
        current: !w.end,
      };
    })
    .sort((a, b) => a.left - b.left);

  return { segments, startYear: Number(firstStart.slice(0, 4)), endYear: now.getFullYear() };
}
