import { describe, it, expect } from 'vitest';
import { workSchema, projectSchema } from '../content/schemas';

const validWork = {
  slug: 'acme',
  name: 'Acme',
  role: 'Full-Stack Developer',
  time: '2020 – 2021',
  start: '2020-03',
  end: '2021-06',
  location: 'Uruguay',
  logo: '/logo_acme.svg',
  highlights: ['Shipped **things**.'],
  technologies: ['Node.js'],
  workMethod: 'Intro line.',
  largeText: ['Context.'],
  projects: [{ title: 'Thing', text: 'Did the thing.' }],
};

describe('Content Schema Validation', () => {
  describe('Work Schema', () => {
    it('accepts a correct work entry', () => {
      expect(workSchema.safeParse(validWork).success).toBe(true);
    });

    it('accepts an optional via', () => {
      expect(workSchema.safeParse({ ...validWork, via: 'via ITC' }).success).toBe(true);
    });

    it('rejects a missing required field', () => {
      const { role, ...noRole } = validWork;
      expect(workSchema.safeParse(noRole).success).toBe(false);
    });

    it('rejects a slug that is not kebab-case', () => {
      expect(workSchema.safeParse({ ...validWork, slug: 'Acme Corp' }).success).toBe(false);
      expect(workSchema.safeParse({ ...validWork, slug: 'gestion-total' }).success).toBe(true);
    });

    it('requires year-month dates', () => {
      expect(workSchema.safeParse({ ...validWork, start: '2020' }).success).toBe(false);
      expect(workSchema.safeParse({ ...validWork, end: '2021-13' }).success).toBe(false);
      const { end, ...current } = validWork;
      expect(workSchema.safeParse(current).success).toBe(true);
    });

    it('requires at least one highlight', () => {
      expect(workSchema.safeParse({ ...validWork, highlights: [] }).success).toBe(false);
    });

    it('rejects technologies that are not plain names', () => {
      expect(workSchema.safeParse({ ...validWork, technologies: [{ name: 'Node.js' }] }).success).toBe(false);
    });
  });

  describe('Project Schema', () => {
    const validProject = { kind: 'featured', name: 'Uruleyes', technologies: ['Node.js'] };

    it('accepts a minimal project', () => {
      expect(projectSchema.safeParse(validProject).success).toBe(true);
    });

    it('accepts a case study with partial fields', () => {
      const p = { ...validProject, kind: 'case', caseStudy: { role: 'Frontend.' } };
      expect(projectSchema.safeParse(p).success).toBe(true);
    });

    it('rejects an unknown kind', () => {
      expect(projectSchema.safeParse({ ...validProject, kind: 'side' }).success).toBe(false);
    });

    it('rejects links that are not URLs', () => {
      expect(projectSchema.safeParse({ ...validProject, url: 'uruleyes' }).success).toBe(false);
      expect(projectSchema.safeParse({ ...validProject, github: 123 }).success).toBe(false);
    });

    it('treats github as optional', () => {
      expect(projectSchema.safeParse(validProject).success).toBe(true);
    });
  });
});
