import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';
import worksEn from '../content/works/en.json';
import worksEs from '../content/works/es.json';
import projectsEn from '../content/projects/en.json';
import projectsEs from '../content/projects/es.json';

const publicDir = resolve(__dirname, '../../public');

describe('Data Integrity', () => {
  describe('Work Logos', () => {
    it('should have all English work logos in public directory', () => {
      worksEn.forEach((work) => {
        if (work.logo) {
          const logoPath = resolve(publicDir, work.logo.replace(/^\//, ''));
          expect(existsSync(logoPath), `Logo not found for ${work.name}: ${work.logo}`).toBe(true);
        }
      });
    });

    it('should have all Spanish work logos in public directory', () => {
      worksEs.forEach((work) => {
        if (work.logo) {
          const logoPath = resolve(publicDir, work.logo.replace(/^\//, ''));
          expect(existsSync(logoPath), `Logo not found for ${work.name}: ${work.logo}`).toBe(true);
        }
      });
    });
  });

  describe('Project Logos', () => {
    it('should have all English project logos in public directory', () => {
      projectsEn.forEach((project) => {
        if (project.logo) {
          const logoPath = resolve(publicDir, project.logo.replace(/^\//, ''));
          expect(existsSync(logoPath), `Logo not found for ${project.name}: ${project.logo}`).toBe(true);
        }
      });
    });

    it('should have all Spanish project logos in public directory', () => {
      projectsEs.forEach((project) => {
        if (project.logo) {
          const logoPath = resolve(publicDir, project.logo.replace(/^\//, ''));
          expect(existsSync(logoPath), `Logo not found for ${project.name}: ${project.logo}`).toBe(true);
        }
      });
    });
  });

  describe('Technology Logos', () => {
    it('should have all work technology logos in public directory', () => {
      const allWorks = [...worksEn, ...worksEs];

      allWorks.forEach((work) => {
        work.technologies.forEach((tech) => {
          if (tech.logo) {
            const logoPath = resolve(publicDir, tech.logo.replace(/^\//, ''));
            expect(existsSync(logoPath), `Tech logo not found for ${tech.name}: ${tech.logo}`).toBe(true);
          }
        });
      });
    });

    it('should have all project technology logos in public directory', () => {
      const allProjects = [...projectsEn, ...projectsEs];

      allProjects.forEach((project) => {
        project.technologies.forEach((tech) => {
          if (tech.logo) {
            const logoPath = resolve(publicDir, tech.logo.replace(/^\//, ''));
            expect(existsSync(logoPath), `Tech logo not found for ${tech.name}: ${tech.logo}`).toBe(true);
          }
        });
      });
    });
  });

  describe('GitHub URLs', () => {
    it('should have valid GitHub URLs for all English projects', () => {
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;

      projectsEn.forEach((project) => {
        expect(project.github, `Invalid GitHub URL for ${project.name}`).toMatch(githubRegex);
        expect(project.github.trim()).toBe(project.github);
        expect(project.github).not.toBe('');
      });
    });

    it('should have valid GitHub URLs for all Spanish projects', () => {
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;

      projectsEs.forEach((project) => {
        expect(project.github, `Invalid GitHub URL for ${project.name}`).toMatch(githubRegex);
        expect(project.github.trim()).toBe(project.github);
        expect(project.github).not.toBe('');
      });
    });
  });

  describe('Data Structure Consistency', () => {
    it('should have matching structure between English and Spanish works', () => {
      expect(worksEn.length).toBe(worksEs.length);

      worksEn.forEach((workEn, index) => {
        const workEs = worksEs[index];

        // Same number of projects
        expect(workEn.projects.length).toBe(workEs.projects.length);

        // Same number of technologies
        expect(workEn.technologies.length).toBe(workEs.technologies.length);

        // Same logo references (should point to same file)
        expect(workEn.logo).toBe(workEs.logo);

        // Technology logos should match
        workEn.technologies.forEach((tech, techIndex) => {
          expect(tech.logo).toBe(workEs.technologies[techIndex].logo);
        });
      });
    });

    it('should have matching structure between English and Spanish projects', () => {
      expect(projectsEn.length).toBe(projectsEs.length);

      projectsEn.forEach((projectEn, index) => {
        const projectEs = projectsEs[index];

        // Same GitHub URL
        expect(projectEn.github).toBe(projectEs.github);

        // Same logo
        expect(projectEn.logo).toBe(projectEs.logo);

        // Same number of technologies
        expect(projectEn.technologies.length).toBe(projectEs.technologies.length);

        // Technology logos should match
        projectEn.technologies.forEach((tech, techIndex) => {
          expect(tech.logo).toBe(projectEs.technologies[techIndex].logo);
        });
      });
    });

    it('should not have duplicate work entries', () => {
      const enNames = worksEn.map(w => w.name.toLowerCase());
      const esNames = worksEs.map(w => w.name.toLowerCase());

      expect(new Set(enNames).size).toBe(enNames.length);
      expect(new Set(esNames).size).toBe(esNames.length);
    });

    it('should not have duplicate project entries', () => {
      const enNames = projectsEn.map(p => p.name.toLowerCase());
      const esNames = projectsEs.map(p => p.name.toLowerCase());

      expect(new Set(enNames).size).toBe(enNames.length);
      expect(new Set(esNames).size).toBe(esNames.length);
    });

    it('should have non-empty required text fields in works', () => {
      [...worksEn, ...worksEs].forEach((work) => {
        expect(work.name.trim()).not.toBe('');
        expect(work.time.trim()).not.toBe('');
        expect(work.text.trim()).not.toBe('');
        expect(work.workMethod.trim()).not.toBe('');
        expect(work.largeText.length).toBeGreaterThan(0);

        work.largeText.forEach((text) => {
          expect(text.trim()).not.toBe('');
        });
      });
    });

    it('should have non-empty required text fields in projects', () => {
      [...projectsEn, ...projectsEs].forEach((project) => {
        expect(project.name.trim()).not.toBe('');
        expect(project.time.trim()).not.toBe('');
        expect(project.text.trim()).not.toBe('');
      });
    });
  });
});
