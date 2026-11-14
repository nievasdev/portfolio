import { describe, it, expect } from 'vitest';
import { CAREER_START, yearsSince } from '../lib/experience';
import { ui } from '../i18n/ui';

describe('yearsSince', () => {
  it('counts from April 1, 2017', () => {
    expect(CAREER_START.getFullYear()).toBe(2017);
    expect(CAREER_START.getMonth()).toBe(3);
    expect(CAREER_START.getDate()).toBe(1);
  });

  it('does not count the current year before April 1', () => {
    expect(yearsSince(CAREER_START, new Date(2026, 2, 31))).toBe(8);
  });

  it('counts the new year from April 1 on', () => {
    expect(yearsSince(CAREER_START, new Date(2026, 3, 1))).toBe(9);
    expect(yearsSince(CAREER_START, new Date(2026, 10, 14))).toBe(9);
    expect(yearsSince(CAREER_START, new Date(2027, 3, 1))).toBe(10);
  });

  it('never goes negative', () => {
    expect(yearsSince(CAREER_START, new Date(2016, 0, 1))).toBe(0);
  });
});

describe('home copy', () => {
  const years = yearsSince(CAREER_START);

  it('shows the computed years in hero and about, in both languages', () => {
    expect(ui.en.hero.facts[0].value).toBe(`${years}+`);
    expect(ui.es.hero.facts[0].value).toBe(`+${years}`);
    expect(ui.en.about.paragraphs[0]).toContain(`${years}+ years`);
    expect(ui.es.about.paragraphs[0]).toContain(`más de ${years} años`);
  });

  it('does not claim cybersecurity as an industry on the home page', () => {
    [ui.en, ui.es].forEach((t) => {
      const home = JSON.stringify([t.hero, t.about, t.meta]);
      expect(home).not.toMatch(/cyber|ciber/i);
    });
  });
});
