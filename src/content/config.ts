import { defineCollection, z } from 'astro:content';

const works = defineCollection({
  type: 'data',
  schema: z.array(z.object({
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
    })),
  })),
});

const projects = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    name: z.string(),
    time: z.string(),
    logo: z.string(),
    text: z.string(),
    largeText: z.array(z.string()).optional(),
    github: z.string(),
    technologies: z.array(z.object({
      name: z.string(),
      logo: z.string(),
    })),
  })),
});

export const collections = {
  works,
  projects,
};