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

  it('en el mismo mes del aniversario, cuenta según el día', () => {
    const midMonthStart = new Date(2017, 3, 15);
    expect(yearsSince(midMonthStart, new Date(2026, 3, 14))).toBe(8);
    expect(yearsSince(midMonthStart, new Date(2026, 3, 15))).toBe(9);
  });

  it('en un mes anterior al aniversario no cuenta el año aunque el día sea mayor', () => {
    expect(yearsSince(new Date(2017, 3, 15), new Date(2026, 2, 20))).toBe(8);
  });

  it('en un mes posterior al aniversario cuenta el año aunque el día sea menor', () => {
    expect(yearsSince(new Date(2017, 3, 15), new Date(2026, 4, 10))).toBe(9);
  });

  it('never goes negative', () => {
    expect(yearsSince(CAREER_START, new Date(2016, 0, 1))).toBe(0);
  });
});

describe('home copy', () => {
  it('muestra los años calculados en el hero, en los dos idiomas (CA-08)', () => {
    const years = yearsSince(CAREER_START);
    expect(ui.en.hero.facts[0].value).toBe(`${years}+`);
    expect(ui.es.hero.facts[0].value).toBe(`+${years}`);
  });

  it('el About no repite los años del hero (R-17)', () => {
    [ui.en, ui.es].forEach((t) => expect(t.about.paragraphs.join(' ')).not.toMatch(/\d+\+? (years|años)/));
  });

  it('does not claim cybersecurity as an industry on the home page', () => {
    [ui.en, ui.es].forEach((t) => {
      const home = JSON.stringify([t.hero, t.about, t.meta]);
      expect(home).not.toMatch(/cyber|ciber/i);
    });
  });
});
