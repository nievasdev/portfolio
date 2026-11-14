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

    it('acepta un identificador de una sola palabra y rechaza un guion al final', () => {
      expect(workSchema.safeParse({ ...validWork, slug: 'antel' }).success).toBe(true);
      expect(workSchema.safeParse({ ...validWork, slug: 'antel-' }).success).toBe(false);
    });

    it('rechaza fechas con texto antes o después del año-mes', () => {
      expect(workSchema.safeParse({ ...validWork, start: 'x2020-03' }).success).toBe(false);
      expect(workSchema.safeParse({ ...validWork, start: '2020-03x' }).success).toBe(false);
    });

    it('exige título y texto en cada proyecto de la empresa', () => {
      expect(workSchema.safeParse({ ...validWork, projects: [{ text: 'Did the thing.' }] }).success).toBe(false);
    });

    it('requires year-month dates', () => {
      expect(workSchema.safeParse({ ...validWork, start: '2020' }).success).toBe(false);
      expect(workSchema.safeParse({ ...validWork, end: '2021-13' }).success).toBe(false);
      const { end, ...current } = validWork;
      expect(workSchema.safeParse(current).success).toBe(true);
    });

    it('exige que el logo sea una ruta absoluta dentro de public/', () => {
      expect(workSchema.safeParse({ ...validWork, logo: 'logo_acme.svg' }).success).toBe(false);
    });

    it('accepts only known diagrams', () => {
      expect(workSchema.safeParse({ ...validWork, diagram: 'transactions' }).success).toBe(true);
      expect(workSchema.safeParse({ ...validWork, diagram: 'pie' }).success).toBe(false);
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

    it('accepts a search box only with an https action', () => {
      const search = { action: 'https://uruleyes.com/', param: 'q', example: 'despido' };
      expect(projectSchema.safeParse({ ...validProject, search }).success).toBe(true);
      expect(projectSchema.safeParse({ ...validProject, search: { ...search, action: 'http://uruleyes.com/' } }).success).toBe(false);
      expect(projectSchema.safeParse({ ...validProject, search: { ...search, param: '' } }).success).toBe(false);
    });

    it('exige que el logo del proyecto sea una ruta absoluta', () => {
      expect(projectSchema.safeParse({ ...validProject, logo: 'logo_uruleyes.svg' }).success).toBe(false);
      expect(projectSchema.safeParse({ ...validProject, logo: '/logo_uruleyes.svg' }).success).toBe(true);
    });

    it('rechaza un caso de estudio con campos que no son texto', () => {
      expect(projectSchema.safeParse({ ...validProject, caseStudy: { role: 42 } }).success).toBe(false);
    });

    it('accepts only known project diagrams', () => {
      expect(projectSchema.safeParse({ ...validProject, diagram: 'search' }).success).toBe(true);
      expect(projectSchema.safeParse({ ...validProject, diagram: 'transactions' }).success).toBe(false);
    });

    it('acepta capturas solo bajo /shots/ y con texto alternativo', () => {
      const shot = { src: '/shots/uruleyes', alt: 'Resultados', width: 1200, height: 750 };
      expect(projectSchema.safeParse({ ...validProject, screenshots: [shot] }).success).toBe(true);
      expect(projectSchema.safeParse({ ...validProject, screenshots: [{ ...shot, src: '/img/uruleyes' }] }).success).toBe(false);
      const { alt, ...withoutAlt } = shot;
      expect(projectSchema.safeParse({ ...validProject, screenshots: [withoutAlt] }).success).toBe(false);
    });

    it('treats github as optional', () => {
      expect(projectSchema.safeParse(validProject).success).toBe(true);
    });
  });
});
