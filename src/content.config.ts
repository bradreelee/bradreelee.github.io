import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Organizations on the career line: employers, schools, clubs, communities.
// One Markdown file per organization in src/content/timeline/.
// The file name (without .md) is the id that projects point to.
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: z.object({
    organization: z.string(),
    title: z.string(), // role or degree, e.g. "백엔드 엔지니어", "컴퓨터공학 학사"
    type: z.enum(['work', 'education', 'community']),
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // omit while it is ongoing
    summary: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

// Projects done inside an organization. `org` must match a timeline file name.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    org: reference('timeline'),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

// Technical problem-solving posts.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    project: reference('projects').optional(), // post about a specific project
    draft: z.boolean().default(false),
  }),
});

export const collections = { timeline, projects, blog };
