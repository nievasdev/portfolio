import { describe, it, expect } from 'vitest';
import { ui } from '../i18n/ui';

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

  it('el dato de industrias es solo texto, sin número destacado ni link', () => {
    expect(ui.en.hero.facts[2]).toEqual({ value: '', label: 'Telecom · SaaS', href: null });
    expect(ui.es.hero.facts[2]).toEqual({ value: '', label: 'Telecomunicaciones · SaaS', href: null });
  });

  it('has no empty strings except the label-only fact', () => {
    const empty = (obj: unknown, path = ''): string[] =>
      obj && typeof obj === 'object'
        ? Object.entries(obj).flatMap(([k, v]) => empty(v, `${path}.${k}`))
        : obj === '' ? [path] : [];
    const allowed = ['.hero.facts.2.value'];
    expect(empty(ui.en).filter((p) => !allowed.includes(p))).toEqual([]);
    expect(empty(ui.es).filter((p) => !allowed.includes(p))).toEqual([]);
  });
});
