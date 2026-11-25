import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per timeline entry in src/content/timeline/.
// Frontmatter holds the facts; the body holds achievements (bullet list).
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: z.object({
    title: z.string(), // role or degree, e.g. "Backend Engineer"
    organization: z.string(),
    type: z.enum(['work', 'education', 'project', 'etc']),
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // omit for "현재"
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    link: z.string().url().optional(),
  }),
});

export const collections = { timeline };
