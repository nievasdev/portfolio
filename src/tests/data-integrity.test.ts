import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import worksEn from '../content/works/en.json';
import worksEs from '../content/works/es.json';
import projectsEn from '../content/projects/en.json';
import projectsEs from '../content/projects/es.json';
import { workSchema, projectSchema } from '../content/schemas';
import { ui } from '../i18n/ui';

const publicDir = resolve(__dirname, '../../public');

// One spelling per technology, everywhere (tags, CV, stack).
const canonicalTech = new Set([
  'Node.js', 'TypeScript', 'JavaScript', 'Express', 'REST', 'GraphQL',
  'React', 'Next.js', 'Tailwind CSS', 'SCSS',
  'MySQL', 'MariaDB', 'PostgreSQL', 'MongoDB', 'Sequelize',
  'Docker', 'GitLab CI/CD', 'Git', 'Jest', 'Linux',
  'Python', 'PHP', 'Flask', 'pgvector', 'Preact',
]);

const allContent = { worksEn, worksEs, projectsEn, projectsEs };

describe('Data Integrity', () => {
  it.each(Object.entries({ worksEn, worksEs }))('%s matches the work schema', (_, works) => {
    works.forEach((w) => expect(workSchema.parse(w)).toBeTruthy());
  });

  it.each(Object.entries({ projectsEn, projectsEs }))('%s matches the project schema', (_, projects) => {
    projects.forEach((p) => expect(projectSchema.parse(p)).toBeTruthy());
  });

  it('has every work logo in public/', () => {
    [...worksEn, ...worksEs].forEach((w) => {
      expect(existsSync(resolve(publicDir, w.logo.slice(1))), w.logo).toBe(true);
    });
  });

  it('has every project logo in public/', () => {
    [...projectsEn, ...projectsEs].forEach((p) => {
      if ('logo' in p && p.logo) expect(existsSync(resolve(publicDir, p.logo.slice(1))), p.logo).toBe(true);
    });
  });

  it('ningún logo conserva el lienzo cuadrado sin recortar (CA-39)', () => {
    const logos = [...worksEn.map((w) => w.logo), ...projectsEn.flatMap((p) => ('logo' in p && p.logo ? [p.logo] : []))];
    logos.forEach((logo) => {
      const svg = readFileSync(resolve(publicDir, logo.slice(1)), 'utf8');
      const [, , width, height] = svg.match(/viewBox="([^"]+)"/)![1].split(/\s+/).map(Number);
      expect(width, logo).not.toBe(height);
    });
  });

  it('ships the favicon, touch icon and fonts', () => {
    ['favicon.svg', 'apple-touch-icon.png', 'fonts/jetbrains-mono-display-600.woff2']
      .forEach((f) => expect(existsSync(resolve(publicDir, f)), f).toBe(true));
  });

  it('uses only canonical technology names', () => {
    const used = [...worksEn, ...worksEs, ...projectsEn, ...projectsEs].flatMap((x) => x.technologies);
    used.forEach((name) => expect(canonicalTech.has(name), name).toBe(true));
  });

  it('uses canonical names in the stack section', () => {
    Object.values(ui).forEach((t) => {
      t.about.stack.flatMap((s) => s.items.split(' · ')).forEach((name) => {
        expect(canonicalTech.has(name), name).toBe(true);
      });
    });
  });

  it('cada punto clave de la home se lee de un vistazo: 15 palabras o menos (R-46)', () => {
    const MAX_WORDS = 15;
    [...worksEn, ...worksEs].flatMap((w) => w.keyPoints).forEach((point) => {
      expect(point.replace(/\*\*/g, '').split(/\s+/).length, point).toBeLessThanOrEqual(MAX_WORDS);
    });
  });

  it('never claims the unverifiable "99.9%" error reduction', () => {
    const text = JSON.stringify({ ...allContent, ui });
    expect(text).not.toMatch(/99[.,]9/);
  });

  it('never ships template placeholders like [N]', () => {
    const strings = (v: unknown): string[] =>
      typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];
    strings({ ...allContent, ui }).forEach((s) => expect(s).not.toMatch(/\[[^\]]+\]/));
  });

  describe('EN / ES parity', () => {
    it('lists the same works in the same order', () => {
      const shape = (w: (typeof worksEn)[number]) => [w.slug, w.logo, w.technologies, 'diagram' in w ? w.diagram : undefined];
      expect(worksEs.map(shape)).toEqual(worksEn.map(shape));
    });

    it('has the same amount of highlights and projects per work', () => {
      worksEn.forEach((w, i) => {
        expect(worksEs[i].highlights.length).toBe(w.highlights.length);
        expect(worksEs[i].keyPoints.length).toBe(w.keyPoints.length);
        expect(worksEs[i].projects.length).toBe(w.projects.length);
      });
    });

    it('lists the same projects in the same order', () => {
      const shape = (p: (typeof projectsEn)[number]) => [p.kind, p.technologies, 'search' in p ? p.search : undefined, 'diagram' in p ? p.diagram : undefined];
      expect(projectsEs.map(shape)).toEqual(projectsEn.map(shape));
    });
  });
});
