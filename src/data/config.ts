import { defineCollection, z } from 'astro:content';

const works = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    time: z.string(),
    logo: z.string(),
    text: z.string(),
    technologies: z.array(z.object({
      name: z.string(),
      logo: z.string()
    }))
  })
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    time: z.string(),
    logo: z.string(),
    text: z.string(),
    largeText: z.array(z.string()),
    github: z.string(),
    technologies: z.array(z.object({
      name: z.string(),
      logo: z.string()
    }))
  })
});

const blog = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    date: z.string(),
    summary: z.string()
  })
});

export const collections = {
  'works': works,
  'projects': projects,
  'blog': blog,
};