import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every collection is split by language: src/content/<collection>/<ko|en>/<slug>.md
// Use the same <slug> in both languages so pages can link to their translation.

// Organizations on the timeline: employers, schools, clubs, communities.
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: z.object({
    organization: z.string(),
    title: z.string(), // role or degree
    type: z.enum(['work', 'education', 'community', 'personal']),
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // omit while it is ongoing
    summary: z.string().optional(),
    link: z.string().url().optional(),
    // Awards and scholarships, listed under the organization's projects.
    honors: z.array(z.object({ title: z.string(), date: z.coerce.date() })).default([]),
  }),
});

// Projects done inside an organization. `org` is the timeline slug (file name).
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    org: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

// Technical problem-solving posts. `project` is an optional project slug.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    project: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { timeline, projects, blog };
