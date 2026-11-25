import { getCollection, type CollectionEntry } from 'astro:content';
import { ui, type Lang } from '../i18n';

export type Org = CollectionEntry<'timeline'>;
export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'blog'>;

/** "ko/company-b" → language and slug. */
export const langOf = (e: { id: string }) => e.id.split('/')[0] as Lang;
export const slugOf = (e: { id: string }) => e.id.split('/').slice(1).join('/');
const inLang = (lang: Lang) => (e: { id: string }) => langOf(e) === lang;

export const ym = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
export const period = (lang: Lang, start: Date, end?: Date) =>
  `${ym(start)} – ${end ? ym(end) : ui[lang].present}`;
export const fmtDate = (lang: Lang, d: Date, long = false) =>
  d.toLocaleDateString(ui[lang].dateLocale, long ? { year: 'numeric', month: 'long', day: 'numeric' } : undefined);

const byStartDesc = <T extends { data: { start: Date } }>(a: T, b: T) =>
  b.data.start.getTime() - a.data.start.getTime();

export async function getOrgs(lang: Lang) {
  return (await getCollection('timeline', inLang(lang))).sort(byStartDesc);
}

export async function getProjects(lang: Lang) {
  return (await getCollection('projects', inLang(lang))).sort(byStartDesc);
}

/** Organizations newest first, each with its projects (newest first). */
export async function getTimeline(lang: Lang) {
  const [orgs, projects] = await Promise.all([getOrgs(lang), getProjects(lang)]);
  return orgs.map((org) => ({
    org,
    projects: projects.filter((p) => p.data.org === slugOf(org)),
  }));
}

export async function getPosts(lang: Lang) {
  return (
    await getCollection('blog', (p) => inLang(lang)(p) && (import.meta.env.DEV || !p.data.draft))
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Slugs that exist in a collection for a language, used to decide where the language toggle points. */
export async function slugsIn(collection: 'projects' | 'blog', lang: Lang) {
  return new Set((await getCollection(collection, inLang(lang))).map(slugOf));
}
