import type { Work } from '../content/schemas';

export interface Segment {
  slug: string;
  name: string;
  // Position and width in % of the span from the first start to `now`.
  left: number;
  width: number;
  current: boolean;
}

// "2022-04" → months since year 0, so differences are whole months.
const months = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

const ym = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

// One segment per job on a bar from the earliest start to today (oldest first).
export function timelineSegments(works: Work[], now: Date = new Date()) {
  const end = months(ym(now));
  const start = Math.min(...works.map((w) => months(w.start)));
  const span = Math.max(1, end - start);
  const pct = (n: number) => Math.round((n / span) * 1000) / 10;

  const segments: Segment[] = works
    .map((w) => {
      const from = months(w.start);
      const to = w.end ? months(w.end) : end;
      return {
        slug: w.slug,
        name: w.name,
        left: pct(from - start),
        width: pct(Math.max(1, to - from)),
        current: !w.end,
      };
    })
    .sort((a, b) => a.left - b.left);

  return { segments, startYear: Math.floor(start / 12), endYear: now.getFullYear() };
}
