import { describe, it, expect } from 'vitest';
import worksEn from '../content/works/en.json';
import worksEs from '../content/works/es.json';
import { workPaths } from '../lib/paths';
import { localePath } from '../i18n/ui';
import type { Work } from '../content/schemas';

describe('Static Path Generation', () => {
  describe('Work detail pages', () => {
    it.each([['en', worksEn], ['es', worksEs]] as const)('generates one page per work (%s)', (_, works) => {
      const paths = workPaths(works as Work[]);
      expect(paths).toHaveLength(works.length);
      paths.forEach((p, i) => {
        expect(p.params.slug).toBe(works[i].slug);
        expect(p.props.work).toBe(works[i]);
      });
    });

    it('links each page to every other work, never itself', () => {
      const paths = workPaths(worksEn as Work[]);
      paths.forEach((p) => {
        expect(p.props.others).toHaveLength(worksEn.length - 1);
        expect(p.props.others.map((o) => o.slug)).not.toContain(p.params.slug);
      });
    });

    it('cada otra empresa lleva su identificador y su nombre (CA-21)', () => {
      const [antel] = workPaths(worksEn as Work[]);
      expect(antel.props.others[0]).toEqual({ slug: 'upshow', name: 'Upshow' });
    });

    it('uses unique kebab-case slugs', () => {
      const slugs = worksEn.map((w) => w.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
    });

    it('uses the same slugs in the same order in both languages', () => {
      expect(worksEs.map((w) => w.slug)).toEqual(worksEn.map((w) => w.slug));
    });
  });

  describe('localePath', () => {
    it('keeps English at the root', () => {
      expect(localePath('en', '/')).toBe('/');
      expect(localePath('en', '/work/antel')).toBe('/work/antel');
    });

    it('prefixes Spanish with /es', () => {
      expect(localePath('es', '/')).toBe('/es');
      expect(localePath('es', '/work/antel')).toBe('/es/work/antel');
    });
  });
});
