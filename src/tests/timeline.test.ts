import { describe, it, expect } from 'vitest';
import worksEn from '../content/works/en.json';
import { timelineSegments } from '../lib/timeline';
import type { Work } from '../content/schemas';

const works = worksEn as Work[];
const now = new Date(2026, 10, 14);
const ROUNDING = 0.1;

// Computed inside each test so mutation testing can attribute the run to it.
const careerTimeline = () => timelineSegments(works, now);

describe('timelineSegments (CA-12)', () => {
  it('spans from the first job to today', () => {
    const { segments, startYear, endYear } = careerTimeline();
    expect(startYear).toBe(2017);
    expect(endYear).toBe(2026);
    expect(segments[0].left).toBe(0);
  });

  it('orders segments oldest first without overlaps', () => {
    const { segments } = careerTimeline();
    for (let i = 1; i < segments.length; i++) {
      const prev = segments[i - 1];
      expect(segments[i].left).toBeGreaterThanOrEqual(prev.left + prev.width - ROUNDING);
    }
  });

  it('keeps every segment inside the bar', () => {
    careerTimeline().segments.forEach((s) => {
      expect(s.width).toBeGreaterThan(0);
      expect(s.left + s.width).toBeLessThanOrEqual(100 + ROUNDING);
    });
  });

  it('runs the current job up to today', () => {
    const current = careerTimeline().segments.filter((s) => s.current);
    expect(current.map((s) => s.slug)).toEqual(['antel']);
    expect(current[0].left + current[0].width).toBeCloseTo(100, 0);
  });

  it('ubica cada empresa en el lugar exacto de la barra, de la más vieja a la actual', () => {
    expect(careerTimeline().segments).toEqual([
      { slug: 'gestion-total', name: 'Gestión Total', left: 0, width: 10.4, current: false },
      { slug: 'hacknoid', name: 'Hacknoid', left: 10.4, width: 33.9, current: false },
      { slug: 'upshow', name: 'Upshow', left: 44.3, width: 7, current: false },
      { slug: 'antel', name: 'Antel', left: 52.2, width: 47.8, current: true },
    ]);
  });

  it('un trabajo que empezó este mes ocupa toda la barra', () => {
    const job = { ...works[0], start: '2026-11', end: undefined };
    const { segments: [only] } = timelineSegments([job], now);
    expect(only).toMatchObject({ left: 0, width: 100, current: true });
  });

  it('el año de inicio sale del primer trabajo aunque empiece en diciembre', () => {
    const job = { ...works[0], start: '2019-12', end: undefined };
    expect(timelineSegments([job], now).startYear).toBe(2019);
  });

  it('sizes jobs by duration', () => {
    const { segments } = careerTimeline();
    const width = (slug: string) => segments.find((s) => s.slug === slug)!.width;
    // Hacknoid (39 months) is longer than Gestión Total (12) and Upshow (8).
    expect(width('hacknoid')).toBeGreaterThan(width('gestion-total'));
    expect(width('gestion-total')).toBeGreaterThan(width('upshow'));
  });
});
