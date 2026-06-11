import { defineCollection, z } from 'astro:content';

const works = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    name: z.string(),
    time: z.string(),
    logo: z.string(),
    text: z.string(),
    tagline: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    largeText: z.array(z.string()),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
    workMethod: z.string(),
    projects: z.array(z.object({
      title: z.string(),
      text: z.string(),
    })),
    technologies: z.array(z.object({
      name: z.string(),
      logo: z.string().optional(),
      category: z.string().optional(),
    })),
  })),
});

const projects = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    name: z.string(),
    time: z.string(),
    logo: z.string().optional(),
    text: z.string(),
    largeText: z.array(z.string()).optional(),
    github: z.string(),
    demo: z.string().optional(),
    screenshot: z.string().optional(),
    technologies: z.array(z.object({
      name: z.string(),
      logo: z.string().optional(),
      category: z.string().optional(),
    })),
  })),
});

export const collections = {
  works,
  projects,
};