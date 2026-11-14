import { describe, it, expect } from 'vitest';
import worksEn from '../content/works/en.json';
import { timelineSegments } from '../lib/timeline';
import type { Work } from '../content/schemas';

const works = worksEn as Work[];
const now = new Date(2026, 10, 14);

describe('timelineSegments', () => {
  const { segments, startYear, endYear } = timelineSegments(works, now);

  it('spans from the first job to today', () => {
    expect(startYear).toBe(2017);
    expect(endYear).toBe(2026);
    expect(segments[0].left).toBe(0);
  });

  it('orders segments oldest first without overlaps', () => {
    for (let i = 1; i < segments.length; i++) {
      const prev = segments[i - 1];
      expect(segments[i].left).toBeGreaterThanOrEqual(prev.left + prev.width - 0.1);
    }
  });

  it('keeps every segment inside the bar', () => {
    segments.forEach((s) => {
      expect(s.width).toBeGreaterThan(0);
      expect(s.left + s.width).toBeLessThanOrEqual(100.1);
    });
  });

  it('runs the current job up to today', () => {
    const current = segments.filter((s) => s.current);
    expect(current.map((s) => s.slug)).toEqual(['antel']);
    expect(current[0].left + current[0].width).toBeCloseTo(100, 0);
  });

  it('sizes jobs by duration', () => {
    const width = (slug: string) => segments.find((s) => s.slug === slug)!.width;
    // Hacknoid (39 months) is longer than Gestión Total (12) and Upshow (8).
    expect(width('hacknoid')).toBeGreaterThan(width('gestion-total'));
    expect(width('gestion-total')).toBeGreaterThan(width('upshow'));
  });
});
