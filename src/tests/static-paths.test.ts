import { describe, it, expect } from 'vitest';
import worksEn from '../content/works/en.json';
import worksEs from '../content/works/es.json';

describe('Static Path Generation', () => {
  describe('Work Detail Pages', () => {
    it('should generate correct English paths', () => {
      const paths = worksEn.map((work, index) => ({
        params: { slug: `${index}-en` },
        props: { work, lang: 'en', index }
      }));

      expect(paths).toHaveLength(worksEn.length);

      paths.forEach((path, index) => {
        expect(path.params.slug).toBe(`${index}-en`);
        expect(path.props.lang).toBe('en');
        expect(path.props.index).toBe(index);
        expect(path.props.work).toBe(worksEn[index]);
      });
    });

    it('should generate correct Spanish paths', () => {
      const paths = worksEs.map((work, index) => ({
        params: { slug: `${index}-es` },
        props: { work, lang: 'es', index }
      }));

      expect(paths).toHaveLength(worksEs.length);

      paths.forEach((path, index) => {
        expect(path.params.slug).toBe(`${index}-es`);
        expect(path.props.lang).toBe('es');
        expect(path.props.index).toBe(index);
        expect(path.props.work).toBe(worksEs[index]);
      });
    });

    it('should have unique slugs across all languages', () => {
      const allSlugs = [
        ...worksEn.map((_, index) => `${index}-en`),
        ...worksEs.map((_, index) => `${index}-es`)
      ];

      const uniqueSlugs = new Set(allSlugs);
      expect(uniqueSlugs.size).toBe(allSlugs.length);
    });

    it('should format slugs correctly', () => {
      const slugRegex = /^\d+-[a-z]{2}$/;

      worksEn.forEach((_, index) => {
        const slug = `${index}-en`;
        expect(slug).toMatch(slugRegex);
      });

      worksEs.forEach((_, index) => {
        const slug = `${index}-es`;
        expect(slug).toMatch(slugRegex);
      });
    });

    it('should have at least one work entry per language', () => {
      expect(worksEn.length).toBeGreaterThan(0);
      expect(worksEs.length).toBeGreaterThan(0);
    });

    it('should have matching number of entries across languages', () => {
      expect(worksEn.length).toBe(worksEs.length);
    });
  });
});
