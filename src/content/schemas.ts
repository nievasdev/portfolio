import { z } from 'astro/zod';

// Kept apart from config.ts so the tests can validate the real schemas
// (astro:content is not importable outside Astro).

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

// Bullets and paragraphs may mark metrics with **bold**; see src/lib/rich.ts.
export const workSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: z.string().min(1),
  via: z.string().optional(),
  role: z.string().min(1),
  time: z.string().min(1),
  // Exact months for the CV ("2022-04"); no end means current job.
  start: yearMonth,
  end: yearMonth.optional(),
  location: z.string().min(1),
  logo: z.string().startsWith('/'),
  highlights: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)),
  workMethod: z.string().min(1),
  largeText: z.array(z.string().min(1)),
  projects: z.array(z.object({
    title: z.string().min(1),
    text: z.string().min(1),
  })),
});

export const projectSchema = z.object({
  kind: z.enum(['featured', 'case', 'earlier']),
  name: z.string().min(1),
  subtitle: z.string().optional(),
  time: z.string().optional(),
  text: z.string().optional(),
  url: z.string().url().optional(),
  caseStudyUrl: z.string().url().optional(),
  github: z.string().url().optional(),
  caseStudy: z.object({
    problem: z.string().optional(),
    role: z.string().optional(),
    built: z.string().optional(),
    result: z.string().optional(),
  }).optional(),
  // `src` is the base path of /public/shots/<name>-{600,1200}.webp; size is the 1200w file.
  screenshots: z.array(z.object({
    src: z.string().startsWith('/shots/'),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })).optional(),
  technologies: z.array(z.string().min(1)),
});

// What only the CV needs; experience, projects and skills come from the site content.
// `{years}` in the summary is replaced with the computed years of experience.
export const cvSchema = z.object({
  headline: z.string().min(1),
  location: z.string().min(1),
  phone: z.string().min(1),
  summary: z.string().includes('{years}'),
  labels: z.object({
    summary: z.string(),
    experience: z.string(),
    projects: z.string(),
    education: z.string(),
    skills: z.string(),
    languages: z.string(),
    references: z.string(),
    present: z.string(),
  }),
  months: z.array(z.string()).length(12),
  projects: z.array(z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    when: z.string().min(1),
    text: z.string().min(1),
  })),
  education: z.array(z.object({
    title: z.string().min(1),
    school: z.string().min(1),
    when: z.string().min(1),
  })),
  languages: z.array(z.string().min(1)),
  references: z.array(z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })),
});

export type Work = z.infer<typeof workSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Cv = z.infer<typeof cvSchema>;
