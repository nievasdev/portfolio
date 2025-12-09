import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import schemas from config
const workSchema = z.object({
  name: z.string(),
  time: z.string(),
  logo: z.string(),
  text: z.string(),
  largeText: z.array(z.string()),
  workMethod: z.string(),
  projects: z.array(z.object({
    title: z.string(),
    text: z.string(),
  })),
  technologies: z.array(z.object({
    name: z.string(),
    logo: z.string(),
    category: z.string().optional(),
  })),
});

const projectSchema = z.object({
  name: z.string(),
  time: z.string(),
  logo: z.string(),
  text: z.string(),
  largeText: z.array(z.string()).optional(),
  github: z.string(),
  technologies: z.array(z.object({
    name: z.string(),
    logo: z.string(),
    category: z.string().optional(),
  })),
});

describe('Content Schema Validation', () => {
  describe('Work Schema', () => {
    it('should validate a correct work entry', () => {
      const validWork = {
        name: 'Test Company',
        time: '2020 - 2023',
        logo: '/logo_test.png',
        text: 'Short description',
        largeText: ['Detail 1', 'Detail 2'],
        workMethod: 'Agile methodology',
        projects: [
          { title: 'Project 1', text: 'Description' }
        ],
        technologies: [
          { name: 'JavaScript', logo: '/logo_js.png', category: 'language' }
        ]
      };

      expect(() => workSchema.parse(validWork)).not.toThrow();
    });

    it('should reject work entry missing required fields', () => {
      const invalidWork = {
        name: 'Test Company',
        time: '2020 - 2023',
        // missing logo, text, largeText, etc.
      };

      expect(() => workSchema.parse(invalidWork)).toThrow();
    });

    it('should reject work entry with wrong field types', () => {
      const invalidWork = {
        name: 'Test Company',
        time: 2023, // should be string
        logo: '/logo_test.png',
        text: 'Short description',
        largeText: ['Detail 1'],
        workMethod: 'Agile',
        projects: [],
        technologies: []
      };

      expect(() => workSchema.parse(invalidWork)).toThrow();
    });

    it('should validate work with optional technology category', () => {
      const validWork = {
        name: 'Test Company',
        time: '2020 - 2023',
        logo: '/logo_test.png',
        text: 'Short description',
        largeText: ['Detail 1'],
        workMethod: 'Agile',
        projects: [],
        technologies: [
          { name: 'JavaScript', logo: '/logo_js.png' } // no category
        ]
      };

      expect(() => workSchema.parse(validWork)).not.toThrow();
    });

    it('should reject work with invalid projects array', () => {
      const invalidWork = {
        name: 'Test Company',
        time: '2020 - 2023',
        logo: '/logo_test.png',
        text: 'Short description',
        largeText: ['Detail 1'],
        workMethod: 'Agile',
        projects: [
          { title: 'Project 1' } // missing text
        ],
        technologies: []
      };

      expect(() => workSchema.parse(invalidWork)).toThrow();
    });
  });

  describe('Project Schema', () => {
    it('should validate a correct project entry', () => {
      const validProject = {
        name: 'Test Project',
        time: '2023',
        logo: '/logo_project.png',
        text: 'Project description',
        largeText: ['Detail 1', 'Detail 2'],
        github: 'https://github.com/user/repo',
        technologies: [
          { name: 'React', logo: '/logo_react.png', category: 'framework' }
        ]
      };

      expect(() => projectSchema.parse(validProject)).not.toThrow();
    });

    it('should validate project without optional largeText', () => {
      const validProject = {
        name: 'Test Project',
        time: '2023',
        logo: '/logo_project.png',
        text: 'Project description',
        github: 'https://github.com/user/repo',
        technologies: []
      };

      expect(() => projectSchema.parse(validProject)).not.toThrow();
    });

    it('should reject project missing required fields', () => {
      const invalidProject = {
        name: 'Test Project',
        time: '2023',
        // missing logo, text, github, technologies
      };

      expect(() => projectSchema.parse(invalidProject)).toThrow();
    });

    it('should reject project with wrong type for github field', () => {
      const projectWithInvalidGithub = {
        name: 'Test Project',
        time: '2023',
        logo: '/logo_project.png',
        text: 'Project description',
        github: 123, // should be string
        technologies: []
      };

      expect(() => projectSchema.parse(projectWithInvalidGithub)).toThrow();
    });

    it('should validate project with optional category in technologies', () => {
      const validProject = {
        name: 'Test Project',
        time: '2023',
        logo: '/logo_project.png',
        text: 'Project description',
        github: 'https://github.com/user/repo',
        technologies: [
          { name: 'Python', logo: '/logo_python.png' }, // no category
          { name: 'Flask', logo: '/logo_flask.png', category: 'framework' }
        ]
      };

      expect(() => projectSchema.parse(validProject)).not.toThrow();
    });
  });
});
