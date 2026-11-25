# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Recruiters and hiring managers screening a full-stack engineer candidate. They usually open the link from a resume or job application, often on mobile, and decide within a minute or two whether to read further.
- Engineers on the interview panel who read deeper: project details and technical blog posts, to judge problem-solving depth before or during interviews.

## Product Purpose

A personal portfolio site for a full-stack engineer who is changing jobs. It presents who the owner is, the career path so far, shipped projects, and blog posts that show how technical problems were analysed and solved. Success means a reader can grasp the career flow quickly and finds enough evidence to invite the owner to an interview.

## Positioning

The career flow is the spine of the site: the home page leads with the timeline, and projects and blog posts are evidence that hangs off that flow rather than a separate gallery.

## Operating Context

- Linked from resumes, job applications and LinkedIn; shared as direct URLs to individual blog posts or projects.
- Read on both desktop and mobile. Primary language is Korean; technical terms stay in their original form.

## Capabilities and Constraints

- Astro static site with Tailwind CSS v4, deployed to GitHub Pages at https://bradreelee.github.io/ by GitHub Actions on push to `main`.
- The timeline is the most important component. Each entry is an organization (employer, school, club or community) and must show the projects the owner did inside that organization, not just the affiliation and dates. Projects belong to an organization; a project page links back to its organization's timeline entry.
- Separate pages, not in-page tabs: home (intro + timeline), projects list and detail, blog list and post. Every post and project has its own URL for sharing and search.
- Content is authored as Markdown files (timeline, projects, blog posts) so the owner can add entries without touching components.
- Undecided: the owner's real name, intro copy, career entries, projects and posts. Current content is placeholder.

## Brand Commitments

- The owner prefers the plain, simple look of the first version (stone neutrals, narrow single column, small vertical timeline with dots, Pretendard). A themed metaphor direction (subway line map) was built and rejected as "too much". Do not reintroduce themed visual worlds; refine within the simple look.
- Avoid heavy animation and dark "hacker" styling.

## Evidence on Hand

- No real content yet. Placeholder intro in `src/data/profile.ts` and sample timeline entries in `src/content/timeline/`.
- Do not fabricate employers, metrics, projects, testimonials or blog posts. Sample entries must stay clearly marked as examples.

## Product Principles

1. The career flow is read first; everything else supports it.
2. Every claim should be traceable to a project or a post the reader can open.
3. Reading comfort beats decoration: posts are long-form technical writing in Korean.
4. Adding a new post or career entry must stay a single Markdown file.

## Accessibility & Inclusion

Korean-first typography (no glyph fallbacks for headings), readable on mobile, keyboard navigable, respects reduced motion.
