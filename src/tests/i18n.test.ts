import { describe, it, expect } from 'vitest';
import { ui, homeSections } from '../i18n/ui';

// Flattens nested keys ('hero.facts.0.label') so missing translations show up by path.
function keys(value: unknown, prefix = ''): string[] {
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe('UI dictionary', () => {
  it('has exactly the same keys in English and Spanish', () => {
    expect(keys(ui.es)).toEqual(keys(ui.en));
  });

  it('el menú lleva a experiencia antes que a proyectos, como la home (CA-18)', () => {
    expect(homeSections).toEqual(['experience', 'projects', 'about', 'contact']);
  });

  it('el hero tiene tres datos con el mismo formato: cifra y etiqueta; los enlaces terminan en «↓» (R-07, R-09)', () => {
    [ui.en, ui.es].forEach((t) => {
      expect(t.hero.facts).toHaveLength(3);
      t.hero.facts.forEach((fact) => {
        expect(fact.value).not.toBe('');
        expect(fact.label.endsWith('↓')).toBe(fact.href !== null);
      });
    });
  });

  it('has no empty strings', () => {
    const empty = (obj: unknown, path = ''): string[] =>
      obj && typeof obj === 'object'
        ? Object.entries(obj).flatMap(([k, v]) => empty(v, `${path}.${k}`))
        : obj === '' ? [path] : [];
    expect(empty(ui.en)).toEqual([]);
    expect(empty(ui.es)).toEqual([]);
  });
});
