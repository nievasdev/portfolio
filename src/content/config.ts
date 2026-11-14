import { defineCollection, z } from 'astro:content';
import { workSchema, projectSchema, cvSchema } from './schemas';

const works = defineCollection({
  type: 'data',
  schema: z.array(workSchema),
});

const projects = defineCollection({
  type: 'data',
  schema: z.array(projectSchema),
});

const cv = defineCollection({
  type: 'data',
  schema: cvSchema,
});

export const collections = {
  works,
  projects,
  cv,
};
